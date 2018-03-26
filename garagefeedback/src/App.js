import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { cyan700, blue100, blue200, fullWhite, redA700, greenA700 } from 'material-ui/styles/colors';
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
import shortid from 'shortid';

const muiTheme = getMuiTheme({
  palette: {
    textColor: cyan700,
  },
  appBar: {
    height: 50,
  },
});
const paperStyle = { 
  textAlign: 'center', 
  padding: 20, 
  display: 'inline-block', 
  alignContent: 'center', 
  alignSelf: 'center' 
};
const styles = {
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
      employeeAlias :"",
      questionsForThisCategory:   
      [
        // {Q: "Did you like the session?", ACategory: "binary"},
        // {Q: "How useful was the content to you?", ACategory: "agreementIntensity"},
        // {Q:"Did you learn something new today?", ACategory: "binary"},
        // {Q:"Would you like to attend an advanced session for the same?", ACategory: "binary"},
        // {Q:"Do you have any suggestions about the content?", ACategory:"text"},
        // {Q:"Do you want to share anything else?", ACategory: "text" }
      ],
      garageEvents: [],
      garageEventDefault: "Garage General Feedback",
      garageEventCategoryDefault:-1,
      phoneScreen:true,
      showFeedback:false, 
      arrowButtonClicked:false, 
      eventChangeHappened:false, 
      snackbarOpen: false,    
      snackbarStatus:0, 
      snackbarMessage:""
    }
  }
  componentDidMount(){
    fetch(`/events`)
    .then(res=>res.json())
    .then(garageEvents=>this.setState({garageEvents}
      // , function () { console.log("zzzzzz: "); console.log(garageEvents[0].EventName._) }
    ));
  }

  handleRequestCloseSuccess = () => {
    this.setState({
      snackbarOpen: false,
      garageEventDefault:"Garage General Feedback",
      garageEventCategoryDefault:-1,
      showFeedback:false, 
      arrowButtonClicked:false, 
      eventChangeHappened:false,
      questionsForThisCategory:[]
    });
  };


  handleEmployeeAliasValueChange(event, newValue) {
    
    this.setState({ employeeAlias: newValue }, function () {
      // console.log(this.state.employeeAlias);
    });
  }
  
  handleemployeeAliasDialogRequestClose() {
    this.setState({ employeeAliasNotSetDialogOpen: false, employeeAliasWrongDialogOpen: false, employeeAliasAlreadyInUseDialogOpen: false });
  }

  handleEventSelection(event, index, value) {
    this.setState({ garageEventDefault: value, arrowButtonClicked:false, eventChangeHappened:true }, function () {
      // console.log("hi")

    });
  }

  handleDisplayFeedbackForm() {
 
    fetch(`/questions?event=${this.state.garageEventDefault}`)
      .then(res=>res.json())
      .then(questionsForThisCategory =>this.setState({questionsForThisCategory}))
      .then(this.setState({ showFeedback: true, arrowButtonClicked:true, eventChangeHappened:false }));  
  }
  
  handleSurveySubmitButton() {
    // console.log("survey submit clicked");
    for(var i=0;i<this.state.questionsForThisCategory.length;i++)
    this.state.questionsForThisCategory[i]['RowKey']._ = (this.state.employeeAlias == "" ? "null" : this.state.employeeAlias);
    // console.log(JSON.stringify(this.state.questionsForThisCategory));


    fetch(`/submit`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',

    },
      body: JSON.stringify(this.state.questionsForThisCategory)
    }).then(res =>
      res.json().then(data => ({
        data: data,
        status: res.status
      })))
    .then(res => {
          this.setState({ snackbarMessage: res.data.msg, snackbarOpen:true, snackbarStatus:res.status }, function () {
      });
    })
      .catch(function(err){
      console.log(err );
      console.log("try resubmitting..");
    })
  }
    
    // ?event=${this.state.garageEventDefault}`)
    //   .then(res=>res.json())
    //   .then(questionsForThisCategory =>this.setState({questionsForThisCategory}))
    //   .then(this.setState({ showFeedback: true, arrowButtonClicked:true, eventChangeHappened:false }));
  // }

  handleBinaryButtonSelection(event, value, myValue) {
    // console.log(value + "--1--" + myValue + "--2--" + event);
    var index =-1;
    var obj = this.state.questionsForThisCategory.find(function(item, i){
      if(item.Question._ === event){
        index = i;
        return i;
      }
    });
    // console.log(index, obj);
    this.state.questionsForThisCategory[index]['Answer'] = myValue;
    // console.log(this.state.questionsForThisCategory[index]);
  }

  handleRadioButtonSelection(event, value, myValue) {
    // console.log(value + "--1--" + myValue + "--2--" + event);
    var index =-1;
    var obj = this.state.questionsForThisCategory.find(function(item, i){
      if(item.Question._ === event){
        index = i;
        return i;
      }
    });
    // console.log(index, obj);
    this.state.questionsForThisCategory[index]['Answer'] = myValue;
    this.state.questionsForThisCategory[index]['EmployeeAlias'] = this.state.employeeAlias;
    this.state.questionsForThisCategory[index]['Event'] = this.state.garageEventDefault;
    this.state.questionsForThisCategory[index]['TimeTicks'] = new Date();
    
    // this.state.questionsForThisCategory[index]['RowKey'] =  { '$': 'Edm.String', _:  new Date() };
    // console.log(this.state.questionsForThisCategory[index]);
  }
  
  handleTextInput(event, value, myValue){
    // console.log(value + "--1--" + myValue + "--2--" + event);
    var index =-1;
    var obj = this.state.questionsForThisCategory.find(function(item, i){
      if(item.Question._ === event){
        index = i;
        return i;
      }
    });
    this.state.questionsForThisCategory[index]['Answer'] = myValue;
    this.state.questionsForThisCategory[index]['EmployeeAlias'] = this.state.employeeAlias;
    this.state.questionsForThisCategory[index]['Event'] = this.state.garageEventDefault;
    this.state.questionsForThisCategory[index]['TimeTicks'] = new Date().getTime();
    
    // console.log(this.state.questionsForThisCategory[index]);
    

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
            hintText="Enter Your Alias/Name"
            style={{ width:"200" }}
            onChange={this.handleEmployeeAliasValueChange.bind(this)}
            floatingLabelText="Employee Alias"
            type="text"
          />
        </MuiThemeProvider>
        
        <br/><br/>
        

        <MuiThemeProvider muiTheme={muiTheme}>
          <DropDownMenu
            onChange={this.handleEventSelection.bind(this)}
            autoWidth={false}
            maxHeight={250}
            style={{width:"300px"}}
            value={this.state.garageEventDefault}  >
            <MenuItem value={-1} primaryText="Select Event For Feedback" />
                {this.state.garageEvents.map(function (elem, i) {
                  // console.log(elem.EventName._);
                  return (<MenuItem value={elem.EventName._} primaryText={elem.EventName._} key={i} />);
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
          {this.state.arrowButtonClicked && 
            <h3> {this.state.garageEventDefault} Survey </h3>
          }

          {this.state.questionsForThisCategory.length == 0 || this.state.eventChangeHappened ? 
            <Paper zDepth={2} style={paperStyle}>
              Loading... Click proceed arrow if not yet! 
            </Paper> 
            : 
            <div>
            {this.state.questionsForThisCategory.map(function (elem, i) { 
              return( 
              <Card key={i}>
                <CardHeader
                  title={i+1+". "+elem.Question._+"?"}
                  style={{textAlign:"left"}} />
                  {elem.AnswerCategory._ == 'intensity' &&
                    <RadioButtonGroup 
                      name={elem.Question._} 
                      style={{display:"flex" , flexDirection:"row"}}
                      onChange={this.handleRadioButtonSelection.bind(this, elem.Question._)}>
                      <RadioButton
                        value="applause"
                        
                        label={ <img src='/imgs/applause.gif' width="65" height="65" alt="Applause" /> }
                        style={styles.radioButton}/>
                      <RadioButton
                        value="littleBit"
                        label={ <img src='/imgs/littleBit.png' width="65" height="45" alt="Little Bit" /> }        
                        style={styles.radioButton}/>
                      <RadioButton
                        value="boring"
                        label={ <img src='/imgs/yawning.gif' width="45" height="45" alt="Kept Yaaawning" /> }        
                        style={styles.radioButton}/>
                      <RadioButton
                        value="worthless"
                        label={ <img src='/imgs/weeping.gif' width="60" height="60" alt="Worthless" /> }        
                        style={styles.radioButton}/>
                    </RadioButtonGroup>
                  }
                  {elem.AnswerCategory._=="binary" &&
                    <RadioButtonGroup 
                      name={elem.Question._} 
                      style={{display:"flex" , flexDirection:"row"}}
                      onChange={this.handleRadioButtonSelection.bind(this, elem.Question._)}
                      // this.handleBinaryButtonSelection.bind(elem.Question._,this)}
                      >
                      
                      <RadioButton
                        key={elem.Question._}
                        value="yes"
                        label={ <img src='/imgs/thumbsUp.gif' width="60" height="60" alt="Yes!" /> }
                        style={styles.radioButton}/>
                      <RadioButton
                        value="no"
                        label={ <img src='/imgs/thumbsDown.gif' width="60" height="60" alt="No!" /> }        
                        style={styles.radioButton}/>
                      <RadioButton
                        value="confused"
                        //https://www.smileysapp.com/gif-emoji/dont-know.gif
                        label={ <img src='/imgs/confused.gif' width="55" height="65" alt="Er..." /> }        
                        style={styles.radioButton}/>
                    </RadioButtonGroup>
                  }

                  {elem.AnswerCategory._=="text" &&
                    <div>
                      <img src='/imgs/writing.gif' width="60" height="60" alt="Writing" />
                      <TextField
                        hintText="Any Suggestion?!"
                        name={elem.Question._}
                        multiLine={true}
                        rows={2} 
                        onChange = {this.handleTextInput.bind(this, elem.Question._)}/>
                    </div>
                  }
          
              </Card>); 
            }, 
          this)}
          <br/>
          <RaisedButton label="Submit" primary={true} style={{margin:"12"}} onClick={this.handleSurveySubmitButton.bind(this)}/>
          <br/><br/>
          <br/>
          {this.state.snackbarStatus==200?
          <Snackbar
          style={{ width: "90%" }}
          bodyStyle={{ backgroundColor: greenA700 }}
          open={this.state.snackbarOpen}
          message={this.state.snackbarMessage}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestCloseSuccess}
        />:
        <Snackbar
          style={{ width: "90%" }}
          bodyStyle={{ backgroundColor: redA700 }}
          open={this.state.snackbarOpen}
          message={this.state.snackbarMessage}
          autoHideDuration={3000}
          onRequestClose={this.handleRequestCloseFailure}
        />}

          </div>
          }
        
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
