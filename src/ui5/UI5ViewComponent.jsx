/* global sap */

import React from 'react';

let current = 0;
function generateId () {
  return `${'anonymous'}-${current++}`
}

class UI5View extends React.Component {

  domRef = React.createRef(null);

  componentDidMount() {
    if (typeof this.createUI5Controller === "function" && typeof this.createUI5View === "function") {
      sap.ui.require([
        "sap/ui/core/mvc/XMLView", "sap/ui/model/json/JSONModel", "sap/ui/model/BindingMode"
      ], (XMLView, JSONModel, BindingMode) => {
        const controllerName = generateId();
        console.log(controllerName, generateId());
        sap.ui.controller(controllerName, this.createUI5Controller());
        XMLView.create({
          controller: sap.ui.controller(controllerName),
          definition: this.createUI5View()
        }).then((ViewInstance) => {
          this.model = new JSONModel(this.state);
          this.model.setDefaultBindingMode(BindingMode.OneWay);
          ViewInstance.setModel(this.model);
          ViewInstance.placeAt(this.domRef.current);
          if (typeof this.viewDidMount === "function") {
            this.viewDidMount(ViewInstance);
          }
        });
      });
    }
  }

  componentWillUnmount() {
    if (typeof this.viewWillUnount === "function") {
      this.viewWillUnount();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    this.model.setData(nextState);
    return false;
  }

  render() {
    return (
      <div ref={this.domRef} ></div>
    );  
  }

}

export default UI5View;
