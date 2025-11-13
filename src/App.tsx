import React from "react";
import ClassDiagram from "./ClassDiagram";
import SideMenu from "./SideMenu";
import Arrows from "./Arrows";

import "./ClassDiagram.css";

function App() {
    return (
		  <>
		     {Arrows}
           <div style={{ width: "100%", height: "100vh" }}>
               <ClassDiagram />
           </div>
		  </>
    );
}

export default App;
