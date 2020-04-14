import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import { Link } from 'react-router-dom'

const Category = (props) => {
    return(
                <Link to={{
              pathname: `/${props.businessId}/categories/${props.product.categoryId}`,
            }}>
            { props.product.visibility ? (
                <Card style={{textAlign:"left"}}>
                    <CardMedia style={{height: 0, paddingTop: '56.25%'}}
                    image={props.product.image}
                    title={props.product.name}
                    />
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="h5">
                        {props.product.name}
                    </Typography>
                    </CardContent>
                </Card>
            ) : null}
            </Link>
            
    )
}
export default Category