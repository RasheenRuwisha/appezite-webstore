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
import './Home.css';
import {connect} from 'react-redux';
import PropType from 'prop-types'
import {login} from '../actions/authActions';
import {clearErrors} from '../actions/errorActions';
import {addToCart} from '../actions/cartActions';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import IconButton from '@material-ui/core/IconButton'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';

class AddToCartModal extends Component {
    state = {
        modal: false,
        email: '',
        password: '',
        msg: null,
        value: 1,
        price: 0,
        initPrice: 0,
        checkboxesValue: [],
        checkBoxMax: [],
        varPrice: 0,
        varName: null
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

    }

    componentDidMount() {
        var addons = this.props.product.addons;
        let max = [];
        for (let i = 0; i < addons.length; i++) {
            let checkBoxMax = {
                name: addons[i].name,
                max: addons[i].maximimCount,
                mandatory: addons[i].addonMandatory,
                current: 0
            }
            max.push(checkBoxMax);
        }
        console.log(max);

        this.setState({checkBoxMax: max})
        var price = 0;
        var varPrice = 0;
        var name = null;
        if (this.props.product.variant.variants.length > 0) {
            price = this.props.product.variant.variants[0].price;
            varPrice = this.props.product.variant.variants[0].price;
            name = this.props.product.variant.variants[0].name;
        } else {
            price = this.props.product.price
        }
        this.setState({modal: this.props.modal, price: price, initPrice: this.props.product.price, varName: name, varPrice: varPrice});
    }

    toggle = () => {
        this
            .props
            .clearErrors();
        this.setState({
            modal: !this.state.modal
        });
    };

    incrementCount = () => {
        let price = 0;
        if (this.state.varPrice === 0) {
            price = parseInt(this.state.price) + parseInt(this.state.initPrice)
        } else {
            price = parseInt(this.state.price) + parseInt(this.state.varPrice)
        }
        this.setState({
            value: this.state.value + 1,
            price: price
        })
    }

    decrementCount = () => {
        if (this.state.value > 1) {
            let price = 0;
            if (this.state.varPrice === 0) {
                price = parseInt(this.state.price) - parseInt(this.state.initPrice)
            } else {
                price = parseInt(this.state.price) - parseInt(this.state.varPrice)
            }
            this.setState({
                value: this.state.value - 1,
                price: price
            })
        }
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    onSubmit = e => {
        e.preventDefault();
        let msg = null;
        let checkBoxMax = this.state.checkBoxMax
        for (let i = 0; i < checkBoxMax.length; i++) {
            if (checkBoxMax[i].mandatory && checkBoxMax[i].current == 0) {

                msg = `Please select atleast 1 ${checkBoxMax[i].name}`;
                this.setState({msg: `Please select atleast 1 ${checkBoxMax[i].name}`})
                break;
            } else {
                this.setState({msg: null})
            }
        }

        if (msg === null) {
            e.preventDefault();

            var cartItem = {
                name: this.props.product.name,
                image: this.props.product.image,
                quantity: this.state.value,
                price: this.state.price,
                addons: this.state.checkboxesValue,
                variant: this.state.varName,
                variantPrice: this.state.varPrice
            }
            this
                .props
                .addToCart(cartItem)
            console.log(cartItem)
            for (let i = 0; i < checkBoxMax.length; i++) {
                checkBoxMax[i].current = 0;
            }
            this.setState({checkBoxMax:checkBoxMax})

            this.toggle();
        }
    };

    addCheckboxesValue = (event, parentAddon, childAddon) => {
        let price = this.state.price;
        let value = {
            parent: parentAddon,
            child: childAddon.name,
            price: childAddon.price
        }
        const {checkboxesValue} = this.state // The state in our class
        let updatedCheckboxesValue = [...checkboxesValue];
        let checkBoxMax = this.state.checkBoxMax;
        let obj = updatedCheckboxesValue.find(x => x.parent === parentAddon && x.child === childAddon.name);
        let index = updatedCheckboxesValue.indexOf(obj);

        let obj1 = checkBoxMax.find(x => x.name === parentAddon);

        if (obj1.max > obj1.current) {
            if (index > -1) {
                obj1.current--;
                updatedCheckboxesValue.splice(index, 1);
                price = parseInt(this.state.price) - parseInt(childAddon.price)
            } else {
                obj1.current++;
                price = parseInt(this.state.price) + parseInt(childAddon.price)

                updatedCheckboxesValue = [
                    ...checkboxesValue,
                    value
                ];
            }
        } else {
            if (index > -1) {
                obj1.current--;
                updatedCheckboxesValue.splice(index, 1);
                price = parseInt(this.state.price) - parseInt(childAddon.price)
            }
            event.target.checked = false;
            event.stopPropagation();
        }

        this.setState({checkboxesValue: updatedCheckboxesValue, price: price, checkBoxMax: checkBoxMax})

    }

    handleChange = () => event => {
        var index = event.nativeEvent.target.selectedIndex;

        var price = parseInt(this.state.price)
        var varPrice = parseInt(this.state.varPrice);
        var varName = event.nativeEvent.target[index].text
        price = parseInt(price) - (parseInt(varPrice) * this.state.value);
        price = parseInt(price) + (parseInt(event.target.value) * this.state.value);

        varPrice = parseInt(event.target.value);
        this.setState({varPrice: varPrice, varName: varName, price: price})
    };

    renderVariant() {
        let variant = this.props.product.variant
        let variantOptions = []
        for (let i = 0; i < variant.variants.length; i++) {
            variantOptions.push(
                <option value={variant.variants[i].price}>{variant.variants[i].name}</option>
            )
        }
        var variantRender = null;
        if (variant.variants.length > 0) {
            variantRender = <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-age-native-simple">
                    {variant.name}
                </InputLabel>
                <Select
                    native
                    onChange={this.handleChange()}
                    labelWidth={400}
                    inputProps={{
                    name: 'age',
                    id: 'outlined-age-native-simple'
                }}>
                    {variantOptions}
                </Select>
            </FormControl>
        }

        return variantRender;
    }

    renderAddons() {
        let addonsRender = [];
        let addons = this.props.product.addons
        for (let i = 0; i < addons.length; i++) {
            let addonsGroups = [];
            for (let z = 0; z < addons[i].addons.length; z++) {
                let parentAddon = addons[i].name
                let childAddon = addons[i].addons[z]
                addonsGroups.push(
                    <FormControlLabel
                        style={{
                        width: '100%'
                    }}
                        onClick={(e) => {
                        this.addCheckboxesValue(e, parentAddon, childAddon)
                    }}
                        labelPlacement="end"
                        control={< Checkbox false value = {
                        addons[i].addons[z].name
                    } />}
                        label={`${addons[i].addons[z].name} ${addons[i].addons[z].price} `}/>
                )
            }
            addonsRender.push(
                <div>
                    <p>{addons[i].name}
                    </p>

                    <FormLabel component="legend">Max allowed addons : {addons[i].maximimCount}</FormLabel>
                    {addonsGroups}
                    <hr></hr>
                </div>
            );
        }
        return addonsRender;
    }

    render() {
        const product = this.props.product;
        return (
            <div>
                <IconButton aria-label="add to favorites" onClick={this.toggle}>
                    <AddShoppingCartIcon/>
                </IconButton>

                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>{product.name}</ModalHeader>
                    {this.state.msg
                        ? <Alert color="danger">{this.state.msg}</Alert>
                        : null}
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>

                                <div>
                                    {this.renderVariant()}
                                </div>
                                <hr></hr>
                                <div>
                                    {this.renderAddons()}
                                </div>

                                <div className="qty-input">
                                    <i className="less" onClick={this.decrementCount}>-</i>
                                    <input type="text" value={this.state.value}/>
                                    <i className="more" onClick={this.incrementCount}>+</i>
                                </div>
                                <p>{this.state.price}</p>

                                <Button
                                    color='dark'
                                    style={{
                                    marginTop: '2rem'
                                }}
                                    block>
                                    Add To Cart
                                </Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({isAuthenticated: state.auth.isAuthenticated, error: state.error, categories: state.categories, business: state.business, products: state.products});

export default connect(mapStateToProps, {login, clearErrors, addToCart})(AddToCartModal);
