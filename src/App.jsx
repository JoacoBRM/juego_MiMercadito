import { useState } from 'react'
import WelcomeScreen  from './screens/WelcomeScreen/WelcomeScreen.jsx'
import MainMenu       from './screens/MainMenu/MainMenu.jsx'
import WeightGame     from './screens/WeightGame/WeightGame.jsx'
import ListGame       from './screens/ListGame/ListGame.jsx'
import CountGame      from './screens/CountGame/CountGame.jsx'
import CreditsScreen  from './screens/CreditsScreen/CreditsScreen.jsx'

const SCREENS = {
  welcome: 'welcome',
  menu:    'menu',
  weight:  'weight',
  list:    'list',
  count:   'count',
  credits: 'credits',
}

export default function App() {
  const [screen, setScreen] = useState(SCREENS.welcome)

  const goHome = () => setScreen(SCREENS.menu)

  return (
    <>
      {screen === SCREENS.welcome && <WelcomeScreen onStart={() => setScreen(SCREENS.menu)} />}
      {screen === SCREENS.menu    && <MainMenu onSelectMode={setScreen} onCredits={() => setScreen(SCREENS.credits)} />}
      {screen === SCREENS.weight  && <WeightGame onBack={goHome} />}
      {screen === SCREENS.list    && <ListGame   onBack={goHome} />}
      {screen === SCREENS.count   && <CountGame  onBack={goHome} />}
      {screen === SCREENS.credits && <CreditsScreen onBack={goHome} />}
    </>
  )
}
