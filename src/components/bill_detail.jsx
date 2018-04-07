import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { fetchBill, logoutUser, loginUser } from '../actions';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError} from 'redux-form';
import axios from 'axios';

const ROOT_URL = 'https://liquidemocracy-api.herokuapp.com';

class BillDetail extends Component {
	constructor(props) {
	    super(props);
	    this.state = {button: ""};
  }

  	renderField(field) {
		const { touched , error }  = field.meta;
		const className = `form-control ${touched && error ? 'border border-danger' : ''}`;
		let type;

		return (
				<div className="form-group">
					<input
						className={ className }
						type={field.type}
						placeholder={field.label}
						{...field.input}
					/>
					<div className="text-help" style={{color: '#B80000'}}>
					{touched ? error : ''}
					</div>
				</div>
			);
	}

	componentDidMount() {
		if(localStorage.getItem("jwt") == null || this.props.user.user.isUserLoggedIn == false) {
			this.setState({button: "disabled"});
		}
		else {
			this.setState({button: ""});
		}
		this.props.fetchBill(this.props.match.params.id);	
	}

	logout() {
		this.props.logoutUser();
		this.props.history.push("/");
	}

	onSubmit(values) {

	const config = { headers: {
		'Content-Type': 'application/json'
	}}

	const request = axios.post(`${ROOT_URL}/api/login/`, values, config)
	.then( (response) => {
		if(response.data.error) {
			throw new error;
		}
		else {
			this.props.loginUser(values);
			this.props.history.push("/");
		}
	})
	.catch(error => {
		throw new SubmissionError({_error: 'Failed to login.'});
	});

	return request;
	}

	renderBillDefaultDetail() {
		return (
			<div>
				<div className="row no-gutters">
					<div className="col">
						<h5>Categories:</h5> {this.props.bill.bill[0].category}
						<br />
						<br />
						<h5>Keywords:</h5>
					</div>
					<div className="col-6 text-center card">
						<h3 className="card-header">{this.props.bill.bill[0].title}</h3>
						<div className="card-body" style={{'height':'300px', 'overflowY': 'auto'}}>
							{this.props.bill.bill[0].text}
							<br />
						</div>
						<div className="card-footer text-muted">
							Vote Date: {new Date(this.props.bill.bill[0].date.$date).toString()}
						</div>
					</div>
					<div className="col">
						<h4 className="text-center">Vote</h4>
						<br />
						<div className="text-center">
							<b>Voter Count: </b>{this.props.bill.bill[0].vote_info.voter_count}
						</div>
						<br />
						<div className="text-center">
							<span className="text-success">Yay: {this.props.bill.bill[0].vote_info.yay} </span>
							| <span className="text-danger">Nay: {this.props.bill.bill[0].vote_info.nay}</span>
						</div>
						<br />
						<div className="text-center">
							<button className={`btn btn-success col-3 ${this.state.button}`}>Yay</button>
							<button className={`btn btn-danger col-3 ${this.state.button}`}>Nay</button>
						</div>
						<br />
						<div className="text-center">
							<button className={`btn btn-info ${this.state.button}`}>Delegate?</button>
						</div>
					</div>
				</div>

				<div className="row no-gutters">
					<div className="col">
			
					</div>
				</div>
			</div>
			)
	}

	render() {
		const { handleSubmit, error } = this.props;

		if(!this.props.bill) {
			return <div>Loading...</div>
		}

		if(localStorage.getItem("jwt") == null || this.props.user.user.isUserLoggedIn == false) {
		return (
				<div className="container-fluid">
					<nav className="navbar bg-primary">
					 
					 <Link className="navbar-brand" style={{color: '#ffffff'}} to="/">Liquidemocracy</Link>
	                
	                <div className="login-form" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
		                <form className="form-inline navbar-form" >
							<Field 
								label="Email"
								name="email"
								type="email"
								component={this.renderField}
							/>
							<Field 
								label="Password"
								name="password"
								type="password"
								component={this.renderField}
							/>
							<button className="btn btn-success" type="submit">Sign in</button>
							<button className="btn btn-info mx-2" 
							onClick={() => this.props.history.push("/signup")}>Sign Up</button>
							<span style={{color: '#B80000'}}>{error}</span>
						</form>
					</div>
					</nav>
					{this.renderBillDefaultDetail()}
				</div>
			)
		}
		else
		{
			return (
					<div className="container-fluid">
						<nav className="navbar bg-primary">
					 
					 	<Link className="navbar-brand" style={{color: '#ffffff'}} to="/">Liquidemocracy</Link>
	                	
	                	<Link className="nav-item" style={{color: '#ffffff'}} to="/profile">
						 Profile
						</Link>
						<Link className="nav-item active" style={{color: '#ffffff'}} to="/delegates">
						 Delegates
						</Link>
						<Link className="nav-item" style={{color: '#ffffff'}} to="/delegations">
						 Delegations
						</Link>
						<div className="nav-item" 
						 	 style={{color: '#ffffff', cursor:'pointer'}} 
						 	 onClick={() => this.logout()}>
						 Log Out
						</div>
						 	
						</nav>
						{this.renderBillDefaultDetail()}
					</div>
				)
		}
	}
}

function validate(values) {

		const errors = {};

		if(!values.email) {
			errors.email = "Email blank.";
		}

		if(!values.password) {
			errors.password = "Password blank.";

		return errors;
	}
}

function mapStateToProps(state) {
	return {bill: state.bills.bill,
			user: state.user};
}

export default reduxForm({
	validate,
	form: 'LoginForm'
})(
connect(mapStateToProps, {fetchBill, logoutUser, loginUser})(BillDetail)
);