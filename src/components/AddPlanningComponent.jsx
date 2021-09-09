import React, { Component } from 'react';
import PlanningService from '../services/PlanningService';

import TextField from '@material-ui/core/TextField';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DatePicker from '@material-ui/lab/DatePicker';
import moment from 'moment';

const DATE_TIME_FORMAT = 'yyyy-MM-DD';
class AddPlanningComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id, //step 2
            titre: '',
            startTime: '',
            sujet: '',
            introduction: ''

        }

        this.changeTitreHandler = this.changeTitreHandler.bind(this);
        this.changeStartTimeHandler = this.changeStartTimeHandler.bind(this);
        this.changeSujetHandler = this.changeSujetHandler.bind(this);
        this.changeIntroductionHandler = this.changeIntroductionHandler.bind(this);

        this.saveOrUpdatePlanning = this.saveOrUpdatePlanning.bind(this);
    }
    //step 3
    componentDidMount() {
        if (this.state.id == 0) {//add
            return
        }
        else if (this.state.id < 0) {//export
            PlanningService.getPlanningById(this.state.id * (-1)).then((res) => {
                let planning = res.data;
                this.setState({
                    titre: planning.titre,
                    sujet: planning.sujet,
                    introduction: planning.introduction,
                    startTime: planning.startTime,
                });
            })
        } else {//update
            PlanningService.getPlanningById(this.state.id).then((res) => {
                let planning = res.data;
                this.setState({
                    titre: planning.titre,
                    sujet: planning.sujet,
                    introduction: planning.introduction,
                    startTime: planning.startTime,
                });
            })
        }
    }

    saveOrUpdatePlanning = (p) => {
        p.preventDefault();
        let planning = { titre: this.state.titre, startTime: this.state.startTime, sujet: this.state.sujet, introduction: this.state.introduction };
        console.log('planning => ' + JSON.stringify(planning));

        if (this.state.id == 0) {//add
            PlanningService.addPlanning(planning).then(res => {
                console.log(" Add :", planning);
                console.log('planning => ' + JSON.stringify(planning));
                this.props.history.push('/plannings/');
            });
        }
        else if (this.state.id < 0) {//export
            PlanningService.addPlanning(planning).then(res => {
                this.props.history.push('/plannings/');
            })
        }
        else {//update
            PlanningService.updatePlanning(planning, this.state.id).then(res => {
                this.props.history.push(`/ViewPlanning/${this.state.id}`);
                // this.props.history.push('/plannings/');
            });
        }


    }

    changeTitreHandler = (event) => {
        this.setState({ titre: event.target.value });
    }
    changeSujetHandler = (event) => {
        this.setState({ sujet: event.target.value });
    }
    changeIntroductionHandler = (event) => {
        this.setState({ introduction: event.target.value });
    }

    changeStartTimeHandler = (value) => {
        console.log(value);
        const formattedDateTime = moment(value).format(DATE_TIME_FORMAT);
        this.setState({ startTime: formattedDateTime });
    }

    cancel() {
        //this.props.history.push('/plannings');


        if (this.state.id == 0) {

            this.props.history.push('/plannings/');

        }
        else if (this.state.id < 0) {

            this.props.history.push('/plannings/');

        }
        else {
            this.props.history.push(`/ViewPlanning/${this.state.id}`);
        }

    }

    getTitle() {
        if (this.state.id == 0) {
            return <h3 className="text-center">Add Planning</h3>
        } else if (this.state.id < 0) {
            return <h3 className="text-center">Exporter Planning</h3>
        } else {
            return <h3 className="text-center">Update Planning</h3>
        }
    }

    render() {
        return (
            <div> <br/>
                <div className="container">
                    <div className="row">
                        <div className="card col-md-6 offset-md-3 offset-md-3">
                            {
                                this.getTitle()
                            }
                            <div className="card-body">
                                <form>
                                    <div className="form-group">
                                        <label>titre:</label>
                                        <input placeholder="titre" name="titre" className="form-control"
                                            value={this.state.titre} onChange={this.changeTitreHandler} />
                                    </div><br />
                                    <div className="form-group">
                                        <label>sujet:</label>
                                        <textarea placeholder="sujet" name="sujet" className="form-control"
                                            value={this.state.sujet} onChange={this.changeSujetHandler} />
                                    </div><br />
                                    <div className="form-group">
                                        <label>introduction:</label>
                                        <textarea placeholder="introduction" name="introduction" className="form-control" 
                                            value={this.state.introduction} onChange={this.changeIntroductionHandler} />
                                    </div><br />
                                    <div className="form-group">
                                        <label>start time:</label><br />
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <DatePicker
                                                inputFormat='yyyy-MM-dd'
                                                renderInput={(props) => <TextField {...props} />}
                                                className="form-date"
                                                value={this.state.startTime}
                                                onChange={(newValue) => this.changeStartTimeHandler(newValue)}
                                            />
                                        </LocalizationProvider>

                                    </div><br />


                                    <button className="btn btn-success" onClick={this.saveOrUpdatePlanning}>Save</button>
                                    <button className="btn btn-danger" onClick={this.cancel.bind(this)} style={{ marginLeft: "10px" }}>Cancel</button>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default AddPlanningComponent;