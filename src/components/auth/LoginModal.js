import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  NavLink,
  Alert
} from 'reactstrap';
import { connect } from 'react-redux';
import PropType from 'prop-types'
import { login  } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';

class Login extends Component {
  state = {
    modal: false,
    email:'',
    password:'',
    msg:null,
  };

  static propTypes = {
      isAuthenticated: PropType.bool,
      clearErrors: PropType.func.isRequired,
      error: PropType.object.isRequired,
      login: PropType.func.isRequired,
      categories: PropType.object.isRequired,
      products: PropType.object.isRequired,
      business: PropType.object.isRequired
  }

  componentDidUpdate(previousProps){
    const { error, isAuthenticated } = this.props;
    if(error != previousProps.error){
        if(error.id === 'LOGIN_FAIL'){
            this.setState({ msg: error.msg.msg })
        }else{
            this.setState({ msg: null })
        }
    }

    if(this.state.modal){
      if(isAuthenticated){
        this.toggle();
      }
    }
  }

 
  componentDidMount(){
    this.setState({
        modal: this.props.modal
      });
  }

  

  toggle = () => {
    this.props.clearErrors();
    this.setState({
      modal: !this.state.modal
    });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const { email, password } = this.state
    const businessId = this.props.business.business.businessId

    const newUser = {
        businessId,
        email,
        password
    }
    
    this.props.login(newUser);

  };

  render() {
    return (
      <div>
          <NavLink
            style={{ color:'#fff'}}
            href="#"
            onClick={this.toggle}
          >
            Login
          </NavLink>

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Login</ModalHeader>
          { this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null }
          <ModalBody>
            <Form onSubmit={this.onSubmit}>
              <FormGroup>

                <Label for='email'>Email</Label>
                <Input
                  type='email'
                  name='email'
                  id='email'
                  className='mb-3'
                  placeholder='Email'
                  onChange={this.onChange}
                />

                <Label for='password'>Password</Label>
                <Input
                  type='password'
                  name='password'
                  className='mb-3'
                  id='password'
                  placeholder='Password'
                  onChange={this.onChange}
                />


                <Button color='dark' style={{ marginTop: '2rem' }} block>
                  Login
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
  categories: state.categories, 
  business: state.business, 
  products: state.products
});

export default connect(
  mapStateToProps,
  { login,clearErrors}
)(Login);