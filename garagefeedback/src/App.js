import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { cyan700, blue100, blue200, fullWhite, redA700 } from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import FooterContent from './FooterContent';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FaArrowRight from 'react-icons/lib/fa/arrow-right';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
// import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

const muiTheme = getMuiTheme({
  palette: {
    textColor: cyan700,
  },
  appBar: {
    height: 50,
  },
});
const styles = {
  block: {
    maxWidth: 250,
  },
  radioButton: {
    width:'10',
    marginBottom: 10,

  },
};
const style = {
  margin: 1,
  marginBottom: 70,
  customWidthBuilding: {
    width: 350
  },
  customWidthLocation: {
    width: 200
  }
};


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employeeIdNotSetDialogOpen: false,
      employeeId :"",
      questionsForThisCategory: [
        {"Q": "Did you like the session?", "ACategory": "binary"},
        {"Q": "How useful was the content to you?", "ACategory": "agreementIntensity"},
        {"Q":"Did you learn something new today?", "ACategory": "binary"},
        {"Q":"Would you like to attend an advanced session for the same?", "ACategory": "binary"},
        {"Q":"Do you have any suggestions about the content?", "ACategory":"text"},
        {"Q":"Do you want to share anything else?", "ACategory": "text" }
      ],
      garageEvents: [{ "evnt": "Garage General Feedback" },
      { "evnt": "Mixed Reality" },
      { "evnt": "3d Printing" }],
      garageEventDefault: -1,
      phoneScreen:true,
      showFeedback:false
    }
  }
  handleEmployeeIdValueChange(event, newValue) {
    this.setState({ employeeId: newValue }, function () {
      console.log(this.state.employeeId);
    });
  }
  
  handleEmployeeIdDialogRequestClose() {
    this.setState({ employeeIdNotSetDialogOpen: false, employeeIdWrongDialogOpen: false, employeeIdAlreadyInUseDialogOpen: false });
  }

  handleEventSelection(event, index, value) {
    this.setState({ garageEventDefault: value }, function () {
      console.log("hi")

    });
  }

  handleDisplayFeedbackForm() {
    this.setState({ showFeedback: true });
  }

  render() {
    // const showFeedback = this.state.showFeedback;
    // const showFeedbackForm = showFeedback ? 
    return (
      <div className="App">
        <div className="App-header">
          { <h1> <br/><span style={{color:blue100}}>Garage Feedback Survey</span><br/></h1>}
          {/* { <img src='/imgs/satya.png' className="App-header" alt="logo" /> } */}
          {/* <p> Distribution</p> */}
        </div>

        {!this.state.phoneScreen &&
        <div className="App-side">
          { <img src='/imgs/blackVertical.png' className="App-sideLeft" alt="logo" />}
        </div>
        }
        {!this.state.phoneScreen &&
        <div className="App-side" >
          { <img src='/imgs/blackVertical.png' className="App-sideRight"  alt="logo" />}
        </div>
        }
       
        <div className="App-footer" style={{ backgroundColor: blue100 }}>
          <FooterContent />
        </div>

        <MuiThemeProvider muiTheme={muiTheme}>
          <TextField className="App-intro"
            hintText="Enter Your Employee Id"
            style={{ width:"200" }}
            onChange={this.handleEmployeeIdValueChange.bind(this)}
            floatingLabelText="Employee Id"
            type="text"
          />
        </MuiThemeProvider>
        
        <br/><br/>
        

        <MuiThemeProvider muiTheme={muiTheme}>
          <DropDownMenu
            onChange={this.handleEventSelection.bind(this)}
            autoWidth={false}
            maxHeight={250}
            style={{width:"200"}}
            value={this.state.garageEventDefault}  >
            <MenuItem value={-1} primaryText="Select Event For Feedback" />
                {this.state.garageEvents.map(function (elem, i) {
                  return (<MenuItem value={elem.evnt} primaryText={elem.evnt} key={i} />);
                }, this)}
          </DropDownMenu>
        </MuiThemeProvider>
          
        <br/><br/>
        <MuiThemeProvider muiTheme={muiTheme}>
          <FloatingActionButton mini={true} onClick={this.handleDisplayFeedbackForm.bind(this)}>
            <FaArrowRight />
          </FloatingActionButton>
        </MuiThemeProvider>

        {this.state.showFeedback &&
         <MuiThemeProvider muiTheme={muiTheme}>
        
         <br/><br/>
         <div style={{paddingLeft:"5%", paddingRight:"5%"}}>
         <h3> {this.state.garageEventDefault!=-1?this.state.garageEventDefault: "Garage General Feedback"} Survey </h3>
         
          {this.state.questionsForThisCategory.length == 0 ? 
         <Paper zDepth={2} style={{ textAlign: 'center', padding: 20, display: 'inline-block', alignContent: 'center', alignSelf: 'center' }}>
          Sorry, no survey questions available at this time. Be back later.
         </Paper> 
         : 
         
         this.state.questionsForThisCategory.map(function (elem, i) {
          return(  
         <Card key={i}>
         
    <CardHeader
      title={i+1+". "+elem.Q}
      style={{textAlign:"left"}}
    />
    {elem.ACategory == 'agreementIntensity' &&
    <RadioButtonGroup name={elem.Q} style={{display:"flex" , flexDirection:"row"}}>
      <RadioButton
        value="applause"
        label={ <img src='https://www.smileysapp.com/gif-emoji/clapping.gif' width="55" height="55" alt="Applause" /> }
        style={styles.radioButton}
      />
      <RadioButton
      value="thismuch"
      label={ <img src='https://2.bp.blogspot.com/-buLrxuPxkI8/V-hDG7QYc-I/AAAAAAAATIs/KFVuXslyuJMgk1eBiw_KGbBJCP_2vMggACLcB/s1600/this-big-emoji.png' width="65" height="45" alt="Just This Much" /> }        
      style={styles.radioButton}
    />
    <RadioButton
        value="boring"
        label={ <img src='http://3.bp.blogspot.com/-cDdxoFCq3mU/VlPAtfwcpHI/AAAAAAAARlc/4NKARbFMv2I/s1600/yawn-smiley.gif' width="40" height="40" alt="Boring" /> }        
        style={styles.radioButton}
      />
    <RadioButton
        value="cry"
        label={ <img src='https://www.smileysapp.com/gif-emoji/weeping.gif' width="55" height="55" alt="Cry" /> }        
        style={styles.radioButton}
      />
    
    </RadioButtonGroup>
    }
    {elem.ACategory=="binary" &&
    <RadioButtonGroup name={elem.Q} style={{display:"flex" , flexDirection:"row"}}>
    <RadioButton
      value="thumbs up"
      label={ <img src='https://www.smileysapp.com/gif-emoji/thumbs-up.gif' width="55" height="55" alt="Yes!" /> }
      style={styles.radioButton}
    />
    <RadioButton
    value="thumbs down"
    label={ <img src='https://www.smileysapp.com/gif-emoji/thumbs-down.gif' width="55" height="55" alt="No!" /> }        
    style={styles.radioButton}
  />
  <RadioButton
      value="confused"
      label={ <img src='https://www.smileysapp.com/gif-emoji/dont-know.gif' width="55" height="55" alt="Er..." /> }        
      style={styles.radioButton}
    />
  </RadioButtonGroup>
  }

{elem.ACategory=="text" &&
    <div>
  <img src='https://www.smileysapp.com/gif-emoji/writing.gif' width="55" height="55" alt="Writing" />
      <TextField
      hintText="Any Suggestions?!"
      multiLine={true}
      rows={2}
    />
</div>}
      
  </Card>
  
         ); 
         }, this)} 
        */}
        {/* <RaisedButton label="Submit" primary={true} style={{margin:"12"}} />
        <br/><br/> */}
      </div>

       </MuiThemeProvider>
      
      }
      <br/>
      <br/>
      <br/>
      </div>
    );
  }
}

export default App;
