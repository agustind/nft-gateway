import React, {Component} from 'react';
import styles from './header.module.css';


class Header extends Component {
    
    render() {
        if(this.props.web3)
        console.log(this.props.web3.currentProvider.selectedAddress);
        return (
            <div className={styles.header}>
                <div className="d-flex flex-row justify-content-center my-auto">
                    <span className={styles.title}>NFT GATEWAY DEMO</span>
                </div>
                <div className='d-flex flex-row justify-content-center my-auto'>
                    <span
                        className={`${styles.link} ${this.props.web3 === undefined 
                            ? styles.yellowCircle 
                            : styles.greenCircle}`
                        }
                        onClick={()=>{this.props.connectFn()}}
                    >
                        {this.props.web3 &&
                            <div>{this.props.web3.currentProvider.selectedAddress}</div>
                        }
                        {!this.props.web3 &&
                            <div>Connect with Metamask</div>
                        }
                    </span>
                </div>
            </div>
        );
    }
}

export default Header;
