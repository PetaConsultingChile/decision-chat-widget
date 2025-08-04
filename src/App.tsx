import './App.css';
import './widget/styles/style.css';

import { WidgetContainer } from './widget/components/widget-container.tsx';

function App() {
  return (
    <>
      <WidgetContainer clientKey={'petawidget_prod234'} />
    </>
  );
}

export default App;
