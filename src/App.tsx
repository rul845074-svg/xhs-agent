import { useState } from 'react'
import { Dashboard } from './views/Dashboard'
import { Compose } from './views/Compose'
import { SessionView } from './views/SessionView'
import { WorkflowView } from './views/WorkflowView'
import { CompareView } from './views/CompareView'
import { ReworkView } from './views/ReworkView'
import { KBDrawer } from './components/KBDrawer'
import { SESSIONS } from './data/sessions'
import { DEFAULT_ACCOUNT, type AccountId } from './data/accounts'

type View = 'dashboard' | 'compose' | 'session' | 'workflow' | 'compare' | 'rework'

function App() {
  const [view, setView] = useState<View>('dashboard')
  const [activeAccount, setActiveAccount] = useState<AccountId>(DEFAULT_ACCOUNT)
  const [chosenTopicId, setChosenTopicId] = useState<string | null>(null)
  const [kbDrawerAccountId, setKbDrawerAccountId] = useState<AccountId | null>(null)

  const goDashboard = () => {
    setView('dashboard')
    setChosenTopicId(null)
  }

  const startCompose = (id: AccountId) => {
    setActiveAccount(id)
    setChosenTopicId(null)
    setView('compose')
  }

  const replaySession = (id: AccountId) => {
    setActiveAccount(id)
    const recommended = SESSIONS[id].topicCandidates.find((t) => t.recommended)
    setChosenTopicId(recommended?.id ?? SESSIONS[id].topicCandidates[0].id)
    setView('session')
  }

  const onComposeDone = (topicId: string) => {
    setChosenTopicId(topicId)
    setView('session')
  }

  const dashboard = (
    <Dashboard
      onStartCompose={startCompose}
      onReplaySession={replaySession}
      onGoWorkflow={() => setView('workflow')}
      onOpenKB={(id) => setKbDrawerAccountId(id)}
      onGoCompare={() => setView('compare')}
      onGoRework={() => setView('rework')}
    />
  )

  const body = (() => {
    if (view === 'compose') {
      return (
        <Compose
          accountId={activeAccount}
          onCancel={goDashboard}
          onDone={onComposeDone}
        />
      )
    }
    if (view === 'session' && chosenTopicId) {
      return (
        <SessionView
          accountId={activeAccount}
          chosenTopicId={chosenTopicId}
          onBackToDashboard={goDashboard}
          onRedo={() => startCompose(activeAccount)}
        />
      )
    }
    if (view === 'workflow') {
      return <WorkflowView onBack={goDashboard} />
    }
    if (view === 'compare') {
      return <CompareView onBack={goDashboard} />
    }
    if (view === 'rework') {
      return <ReworkView onBack={goDashboard} />
    }
    return dashboard
  })()

  return (
    <>
      {body}
      <KBDrawer
        accountId={kbDrawerAccountId}
        onClose={() => setKbDrawerAccountId(null)}
        onGoCompare={() => {
          setKbDrawerAccountId(null)
          setView('compare')
        }}
      />
    </>
  )
}

export default App
