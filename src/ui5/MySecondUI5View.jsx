import UI5ViewComponent from './UI5ViewComponent';

class MySecondUI5View extends UI5ViewComponent {

  constructor(props) {
    super(props);
    this.state = {
      text: "Hello World"
    };
  }

  createUI5View() {
    return `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true">
      <App>
        <Page title="{/text}">
          <VBox>
            <Input value="{/text}" liveChange=".doUpdate"/>
            <Link text="Back to Home" href="/"/>
            <Link text="To other view" href="/view"/>
          </VBox>
        </Page>
      </App>
    </mvc:View>`;
  }

  createUI5Controller() {
    const updateState = (newState) => {
      this.setState(newState);
    };
    return {
      doUpdate(event) {
        updateState({
          text: event.getSource().getValue()
        });
      }
    };
  }

}

export default MySecondUI5View;
