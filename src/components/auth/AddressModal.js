import React, {Component} from 'react';
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
import {connect} from 'react-redux';
import PropType from 'prop-types'
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import {fi} from 'date-fns/locale';
class Address extends Component {

    state = {
        modal: false,
        email: '',
        password: '',
        msg: null,
        states: []
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

    componentDidUpdate(previousProps) {
        const {error, isAuthenticated} = this.props;
        if (error != previousProps.error) {
            if (error.id === 'LOGIN_FAIL') {
                this.setState({msg: error.msg.msg})
            } else {
                this.setState({msg: null})
            }
        }

        if (this.state.modal) {
            if (isAuthenticated) {
                this.toggle();
            }
        }
    }

    componentDidMount() {
        this.setState({modal: this.props.modal});
        let deliveryLocations = this.props.business.business.deliveryLocation;
        const unique = [...new Set(deliveryLocations.map(item => item.state))];
        let i = 0;
        var firstCity;
        this.setState({states: unique, selectedState: unique[0]})
        for (i; i < unique.length; i++) {
            let states = [];
            let cities = [];
            let stateName = unique[i] + 'options';
            for (let z = 0; z < deliveryLocations.length; z++) {
                if (deliveryLocations[z].state === unique[i]) {
                    if (z == 0 && i == 0) {
                        firstCity = deliveryLocations[z].city
                    }
                    var option = <option value={deliveryLocations[z].city}>{deliveryLocations[z].city}</option>
                    states.push(option);
                    cities.push(deliveryLocations[z].city)
                }
            }
            this.setState({
                [unique[i]]: states,
                [stateName]: cities
            })
        }
        this.setState({selectedCity: firstCity})
    }

    toggle = () => e => {
        e.preventDefault();
        this.setState({
            modal: !this.state.modal
        });
    };

    handleStateChange = (e) => {
        var first = this.state[e.target.value + 'options'];
        this.setState({selectedState: e.target.value, selectedCity: first[0]});
    };

    handleCityChange = (e) => {
        this.setState({selectedCity: e.target.value});
    };

    onSubmit = e => {
        e.preventDefault();

        const {email, password} = this.state
        const businessId = this.props.business.business.businessId

        const newUser = {
            businessId,
            email,
            password
        }

        this
            .props
            .login(newUser);

    };

    render() {
        let states = []
        for (let i = 0; i < this.state.states.length; i++) {
            states.push(
                <option value={this.state.states[i]}>{this.state.states[i]}</option>
            )
        }

        return (
            <div >
                <div>
                    <TextField
                        value="s"
                        style={{
                        width: '100%',
                        marginBottom: 30
                    }}
                        id="outlined-basic"
                        label="Address Line 1"
                        variant="outlined"/>

                    <br></br>
                    <TextField
                        value="s"
                        style={{
                        width: '100%',
                        marginBottom: 30
                    }}
                        id="outlined-basic"
                        label="Address Line 2"
                        variant="outlined"/>

                    <br></br>
                    <FormControl
                        variant="outlined"
                        style={{
                        width: '100%',
                        marginBottom: 30
                    }}>
                        <InputLabel htmlFor="outlined-age-native-simple">
                            State
                        </InputLabel>
                        <Select
                            onChange={(e) => {
                            this.handleStateChange(e)
                        }}
                            native
                            labelWidth={400}
                            inputProps={{
                            name: 'age',
                            id: 'outlined-age-native-simple'
                        }}>
                            {states}
                        </Select>
                    </FormControl>

                    <br></br>
                    <FormControl
                        variant="outlined"
                        style={{
                        width: '100%',
                        marginBottom: 30
                    }}>
                        <InputLabel htmlFor="outlined-age-native-simple">
                            City
                        </InputLabel>
                        <Select
                            onChange={(e) => {
                            this.handleCityChange(e)
                        }}
                            native
                            labelWidth={400}
                            inputProps={{
                            name: 'age',
                            id: 'outlined-age-native-simple'
                        }}>
                            {this.state[this.state.selectedState]}
                        </Select>
                    </FormControl>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({isAuthenticated: state.auth.isAuthenticated, error: state.error, categories: state.categories, business: state.business, products: state.products});

export default connect(mapStateToProps, {})(Address);