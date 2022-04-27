import "./App.css";
import Map from "./component/OpenStreet/Map";
import Form from "./component/Form/Form";
import store from "./Redux/Store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import Complete from "./component/Complete";
function App() {
  const [screen, setScreen] = useState(0);
  return (
    <div className="App">
      <>
        <Provider store={store}>
          <ToastContainer />
          {screen == 0 && <Form setScreen={setScreen} />}
          {screen == 1 && <Map setScreen={setScreen} />}
          {screen == 2 && <Complete setScreen={setScreen} />}
        </Provider>
        {/* <AreaEditor /> */}
        {/* <Map /> */}
      </>
    </div>
  );
}

export default App;
