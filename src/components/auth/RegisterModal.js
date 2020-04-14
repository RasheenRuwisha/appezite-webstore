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
import { register } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import ReactLoading from 'react-loading';

class RegisterModal extends Component {
  state = {
    modal: false,
    name: '',
    email:'',
    password:'',
    phone:'',
    msg:null,
    processing:false
  };

  static propTypes = {
      isAuthenticated: PropType.bool,
      clearErrors: PropType.func.isRequired,
      error: PropType.object.isRequired,
      register: PropType.func.isRequired,
      categories: PropType.object.isRequired,
      products: PropType.object.isRequired,
      business: PropType.object.isRequired
  }

  componentDidUpdate(previousProps){
    const { error, isAuthenticated } = this.props;
    if(error != previousProps.error){
      this.setState({processing:false})
        if(error.id === 'REGISTER_FAIL'){
            this.setState({ msg: error.msg.msg })
        }else{
            this.setState({ msg: null })
        }
    }

    if(this.state.modal){
      if(isAuthenticated){
        this.toggle();
        this.setState({processing:false})
      }
    }
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

    const { email, password, name, phone } = this.state
    const businessId = this.props.business.business.businessId

    const newUser = {
        businessId,
        email,
        name,
        phone,
        password
    }
    this.setState({processing:true})
    this.props.register(newUser);

  };

  render() {
    return (
      <div>
          <NavLink
            style={{ color:'#fff'}}
            href="#"
            onClick={this.toggle}
          >
            Register
          </NavLink>

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Register</ModalHeader>
          { this.state.msg ? <Alert color="danger">{this.state.msg}</Alert> : null }
          <ModalBody>
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
              <Label for='name'>Name</Label>
                <Input
                  type='text'
                  name='name'
                  id='name'
                  className='mb-3'
                  placeholder='Name'
                  onChange={this.onChange}
                />


                <Label for='email'>Email</Label>
                <Input
                  type='email'
                  name='email'
                  id='email'
                  className='mb-3'
                  placeholder='Email'
                  onChange={this.onChange}
                />

                <Label for='email'>Phone</Label>
                <Input
                  type='text'
                  name='phone'
                  id='phone'
                  className='mb-3'
                  placeholder='Phone'
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


                {
                  this.state.processing?
                  <div style={{display:'flex', justifyContent:'center'}}>
                            <ReactLoading type="balls" color="#000"/>
                        </div>:
<Button color='dark' style={{ marginTop: '2rem' }} block>
                  Register
                </Button>
                }
                
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
  { register,clearErrors}
)(RegisterModal);