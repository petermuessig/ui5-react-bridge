import UI5ViewComponent from './UI5ViewComponent';

class MyUI5View extends UI5ViewComponent {

  constructor(props) {
    super(props);
    this.state = {
      title: "UI5 React Bridge",
      hello: "Hello World",
      date: new Date()
    };
  }

  createUI5View() {
    return `<mvc:View xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" displayBlock="true">
      <App>
        <Page title="{/title}">
          <headerContent>
            <Link icon="sap-icon://home" href="/" />
          </headerContent>
          <subHeader>
            <OverflowToolbar>
              <Text text="{/date}"/>
            </OverflowToolbar>
          </subHeader>
          <content>
            <VBox>
              <Input value="{/hello}" liveChange=".doUpdate2"/>
              <Input id="myInput1" value="{/hello}" change=".doUpdate2"/>
              <Input value="{/title}" liveChange=".doUpdate"/>
              <Input id="myInput" value="{/title}" change=".doUpdate"/>
              <Button text="Click me!" press= ".doSomething"/>
            </VBox>
          </content>
          <footer>
            <OverflowToolbar>
              <ToolbarSpacer/>
              <Link text="Home" href="/" />
              <Link text="Other" href="/other" />
            </OverflowToolbar>
          </footer>
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
          title: event.getSource().getValue()
        });
      },
      doUpdate2(event) {
        updateState({
          hello: event.getSource().getValue()
        });
      },
      doSomething() {
        alert("Clicked!" + this.getView().byId("myInput").getValue());
      }
    };
  }

  viewDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  viewWillUnmount() {
    clearInterval(this.timerID);
  }
  
  tick() {
    this.setState({
      date: new Date()
    });
  }

}

export default MyUI5View;
