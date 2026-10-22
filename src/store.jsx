import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { uid } from './util.js'
import { blankState, seedState } from './seed.js'

const KEY = 'meibook.v1'

const load = () => {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && parsed.schema === 1) return parsed
    }
  } catch {
    /* corrupted storage -> start over with demo */
  }
  return seedState() // first run: demo data so the app is instantly understandable
}

const reducer = (state, action) => {
  const p = action.payload
  switch (action.type) {
    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, p] }
    case 'UPDATE_CLIENT':
      return { ...state, clients: state.clients.map((c) => (c.id === p.id ? { ...c, ...p } : c)) }

    case 'ADD_APPT':
      return { ...state, appointments: [...state.appointments, p] }
    case 'UPDATE_APPT':
      return { ...state, appointments: state.appointments.map((a) => (a.id === p.id ? { ...a, ...p } : a)) }
    case 'COMPLETE_APPT': {
      // p: { id, payMethod: 'card' | 'cash' | 'transfer' }
      const appt = state.appointments.find((a) => a.id === p.id)
      if (!appt) return state
      const appointments = state.appointments.map((a) =>
        a.id === p.id ? { ...a, status: 'done', payMethod: p.payMethod } : a
      )
      let ledger = state.ledger
      if (p.payMethod === 'card') {
        const svc = state.services.find((s) => s.id === appt.serviceId)
        ledger = [
          ...ledger,
          {
            id: uid(),
            clientId: appt.clientId,
            type: 'deduct',
            amount: appt.price,
            bonus: 0,
            apptId: appt.id,
            ts: Date.now(),
            note: svc ? svc.name : '服务扣卡',
          },
        ]
      }
      return { ...state, appointments, ledger }
    }

    case 'ADD_LEDGER':
      return { ...state, ledger: [...state.ledger, p] }

    case 'ADD_SERVICE':
      return { ...state, services: [...state.services, p] }
    case 'UPDATE_SERVICE':
      return { ...state, services: state.services.map((s) => (s.id === p.id ? { ...s, ...p } : s)) }

    case 'SET_SETTINGS':
      return { ...state, settings: { ...state.settings, ...p } }

    case 'IMPORT_STATE':
      return p
    case 'RESET_BLANK': {
      const b = blankState()
      // keep studio name + template across the demo-data wipe
      b.settings = { ...b.settings, studioName: state.settings.studioName, remindTemplate: state.settings.remindTemplate }
      return b
    }
    default:
      return state
  }
}

const StoreCtx = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage full or blocked — app still works in memory */
    }
  }, [state])

  const actions = useMemo(
    () => ({
      addClient: (data) => {
        const c = { id: uid(), name: '', wechat: '', phone: '', note: '', createdAt: Date.now(), ...data }
        dispatch({ type: 'ADD_CLIENT', payload: c })
        return c
      },
      updateClient: (data) => dispatch({ type: 'UPDATE_CLIENT', payload: data }),

      addAppt: (data) => {
        const a = {
          id: uid(),
          clientId: null,
          serviceId: null,
          date: '',
          time: '',
          durationMin: 60,
          price: 0,
          payMethod: null,
          status: 'booked',
          reminded: false,
          note: '',
          ...data,
        }
        dispatch({ type: 'ADD_APPT', payload: a })
        return a
      },
      updateAppt: (data) => dispatch({ type: 'UPDATE_APPT', payload: data }),
      completeAppt: (id, payMethod) => dispatch({ type: 'COMPLETE_APPT', payload: { id, payMethod } }),
      cancelAppt: (id) => dispatch({ type: 'UPDATE_APPT', payload: { id, status: 'cancelled' } }),
      noshowAppt: (id) => dispatch({ type: 'UPDATE_APPT', payload: { id, status: 'noshow' } }),
      markReminded: (id, reminded = true) => dispatch({ type: 'UPDATE_APPT', payload: { id, reminded } }),

      topup: ({ clientId, amount, bonus, note }) =>
        dispatch({
          type: 'ADD_LEDGER',
          payload: { id: uid(), clientId, type: 'topup', amount, bonus: bonus || 0, apptId: null, ts: Date.now(), note: note || '' },
        }),
      adjust: ({ clientId, amount, note }) =>
        dispatch({
          type: 'ADD_LEDGER',
          payload: { id: uid(), clientId, type: 'adjust', amount, bonus: 0, apptId: null, ts: Date.now(), note: note || '' },
        }),

      addService: (data) => dispatch({ type: 'ADD_SERVICE', payload: { id: uid(), active: true, ...data } }),
      updateService: (data) => dispatch({ type: 'UPDATE_SERVICE', payload: data }),

      setSettings: (data) => dispatch({ type: 'SET_SETTINGS', payload: data }),
      importState: (data) => dispatch({ type: 'IMPORT_STATE', payload: data }),
      resetBlank: () => dispatch({ type: 'RESET_BLANK' }),
    }),
    []
  )

  const value = useMemo(() => ({ state, actions }), [state, actions])
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export const useStore = () => useContext(StoreCtx)

// ---- selectors ----
export const balanceOf = (state, clientId) =>
  state.ledger.reduce((sum, e) => {
    if (e.clientId !== clientId) return sum
    if (e.type === 'topup') return sum + e.amount + (e.bonus || 0)
    if (e.type === 'deduct') return sum - e.amount
    return sum + e.amount // adjust: signed
  }, 0)

export const clientById = (state, id) => state.clients.find((c) => c.id === id)
export const serviceById = (state, id) => state.services.find((s) => s.id === id)

export const apptsOn = (state, dstr) =>
  state.appointments.filter((a) => a.date === dstr).sort((a, b) => a.time.localeCompare(b.time))

export const lastVisitOf = (state, clientId) => {
  const done = state.appointments
    .filter((a) => a.clientId === clientId && a.status === 'done')
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  return done.length ? done[done.length - 1] : null
}
