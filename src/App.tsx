import { useState } from 'react'
import { Dashboard } from './views/Dashboard'
import { Compose } from './views/Compose'
import { SessionView } from './views/SessionView'
import { WorkflowView } from './views/WorkflowView'
import { SESSIONS } from './data/sessions'
import { DEFAULT_ACCOUNT, type AccountId } from './data/accounts'

type View = 'dashboard' | 'compose' | 'session' | 'workflow'

function App() {
  const [view, setView] = useState<View>('dashboard')
  const [activeAccount, setActiveAccount] = useState<AccountId>(DEFAULT_ACCOUNT)
  const [chosenTopicId, setChosenTopicId] = useState<string | null>(null)

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

  if (view === 'dashboard') {
    return (
      <Dashboard
        onStartCompose={startCompose}
        onReplaySession={replaySession}
        onGoWorkflow={() => setView('workflow')}
      />
    )
  }

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

  return null
}

export default App
