import React from 'react'

import HorrorCard from './HorrorCard.js';


class Wheel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            radius: 220,
            cards: [],
            theta: 0.0,
            snap_point: { x: null, y: null },
            snap_in_progress: false,
            children_loaded: 0,
            loaded: false
        }

        this.temp_theta = 0.0;
        this.anim_id = null;
    }

    componentDidMount() {
        let center_of_wheel = {
            x: parseFloat(this.wheel.style.width) / 2,
            y: parseFloat(this.wheel.style.height) / 2
        }
        let temp_cards = [];

        for (let i = 0; i < 12; i++) {
            temp_cards.push(
                <HorrorCard radius={this.state.radius} theta={(Math.PI / 6) * i} center={center_of_wheel} key={`card_${i}`} pic={`./horrorZodiacs/${i}-horrorZodiac.PNG`} amLoaded={this.children_loaded} />
            );
        }
        // pic={`https://picsum.photos/500/500`}
        // pic={`../assets/cuteZodiacs/${i}-cuteZodiac.PNG`

        this.setState({ cards: temp_cards });
    }

    handle_scroll = event => {
        event.preventDefault()
        if (!this.state.loaded && this.state.snap_in_progress) {
            return;
        } else {
            clearTimeout(this.anim_id);
            let scroll_speed = (event.deltaY / 360) * 20;
            this.temp_theta += scroll_speed;

            this.wheel.style.transitionDelay = '0.0s';
            this.wheel.style.transitionDuration = '0.0s';
            this.wheel.style.transform = `translate(-50%, -50%) rotate(${this.temp_theta}deg)`;
            // this.wheel.style.transform = `translate(-50%, -50%) rotate(${this.temp_theta + (event.deltaY * 0.5)}deg)`;
            // this.temp_theta += (event.deltaY * 0.5);

            // So the images don't spin with the wheel and go upside down. rotate the cards in the opposite direction of the wheel to maintain equilibrium
            for (let i = 0; i < this.wheel.children.length; i++) {
                this.wheel.children[i].style.transitionDelay = '0.0s';
                this.wheel.children[i].style.transitionDuration = '0.0s';
                this.wheel.children[i].style.transform = `translate(-50%, -50%) rotate(${-1.0 * this.temp_theta}deg)`;
            }

            this.anim_id = setTimeout(() => {
                this.setState({ theta: this.temp_theta, snap_in_progress: true }, () => {
                    this.snap_back();
                });
            }, 150);
        }
    }

    children_loaded = () => {
        this.setState(prevState => {
            return {
                children_loaded: prevState.children_loaded + 1
            }
        }, () => {
            if (this.state.children_loaded === 12) {
                this.setState({
                    loaded: true,
                    snap_point: {
                        x: this.wheel.children[2].getBoundingClientRect().x + (this.wheel.children[2].getBoundingClientRect().width / 2),
                        y: this.wheel.children[2].getBoundingClientRect().y + (this.wheel.children[2].getBoundingClientRect().height / 2),
                    }
                });
            }
        });
    }

    snap_back = () => {
        let center_of_wheel = {
            x: this.wheel.getBoundingClientRect().x + (this.wheel.getBoundingClientRect().width / 2),
            y: this.wheel.getBoundingClientRect().y + (this.wheel.getBoundingClientRect().height / 2)
        }
        let snap_point_theta = Math.atan2(Math.abs(this.state.snap_point.y - center_of_wheel.y), Math.abs(this.state.snap_point.x - center_of_wheel.x));
        snap_point_theta = snap_point_theta * (180 / Math.PI);

        //calculating shortest distance
        let shortest_distance =
            Math.pow(((this.wheel.children[3].getBoundingClientRect().x + 100) - this.state.snap_point.x), 2) +
            Math.pow(((this.wheel.children[3].getBoundingClientRect().y + 100) - this.state.snap_point.y), 2);
        shortest_distance = Math.sqrt(shortest_distance);

        let closest_card = null;

        // loop through all cards and compare distances to snap_point; find shortest distance
        for (let i = 0; i < this.wheel.children.length; i++) {
            let dx = (this.wheel.children[i].getBoundingClientRect().x + 100) - this.state.snap_point.x;
            let dy = (this.wheel.children[i].getBoundingClientRect().y + 100) - this.state.snap_point.y;
            let current_distance = Math.pow(dx, 2) + Math.pow(dy, 2);
            current_distance = Math.sqrt(current_distance)

            if (shortest_distance >= current_distance) {
                shortest_distance = current_distance;
                closest_card = this.wheel.children[i];
            }
        }

        // find angle between snap_point's theta and closest_card's theta. Calculate theta between closest card and snap point.
        let closest_cards_x = closest_card.getBoundingClientRect().x + (closest_card.getBoundingClientRect().width / 2);
        let closest_cards_y = closest_card.getBoundingClientRect().y + (closest_card.getBoundingClientRect().height / 2);

        let closest_cards_theta = Math.atan2(Math.abs(closest_cards_y - center_of_wheel.y), Math.abs(closest_cards_x - center_of_wheel.x));
        closest_cards_theta = closest_cards_theta * (180 / Math.PI);

        //simple subtraction by getting difference
        let theta_between = Math.abs(closest_cards_theta - snap_point_theta);

        // decide whether to make a positive or negative degree shift
        if (closest_cards_x > center_of_wheel.x && closest_cards_y <= center_of_wheel.y) { // QI
            theta_between = closest_cards_theta > snap_point_theta ? theta_between : -1.0 * theta_between;
        } else if (closest_cards_x <= center_of_wheel.x && closest_cards_y <= center_of_wheel.y) { // QII
            theta_between = closest_cards_theta > snap_point_theta ? -1.0 * theta_between : theta_between;
        } else if (closest_cards_x <= center_of_wheel.x && closest_cards_y > center_of_wheel.y) { // QIII
            theta_between = closest_cards_theta > snap_point_theta ? theta_between : -1.0 * theta_between;
        } else if (closest_cards_x > center_of_wheel.x && closest_cards_y >= center_of_wheel.y) { // QIV
            theta_between = closest_cards_theta > snap_point_theta ? -1.0 * theta_between : theta_between;
        }

        // snap wheel towards snapping point
        this.wheel.style.transitionDelay = '0.1s';
        this.wheel.style.transitionDuration = '1.0s';
        this.wheel.style.transform = `translate(-50%, -50%) rotate(${this.state.theta + theta_between}deg)`;

        // rotate the cards in the opposite direction of the wheel to maintain equilibrium
        for (let i = 0; i < this.wheel.children.length; i++) {
            this.wheel.children[i].style.transitionDelay = '0.1s';
            this.wheel.children[i].style.transitionDuration = '1.0s';

            this.wheel.children[i].style.transform = `translate(-50%, -50%) rotate(${-1.0 * (this.state.theta + theta_between)}deg) scale(1.0)`;

        }

        setTimeout(() => {
            this.setState(prevState => {
                return {
                    snap_in_progress: false,
                    theta: prevState.theta + theta_between
                }
            });
        }, 150);
    }

    render() {
        return (
            <div onWheel={this.handle_scroll} ref={ref_id => this.wheel = ref_id} style={styles.wheel}>
                {this.state.cards}
            </div>
        )

    }
}

const styles = {
    wheel: {
        margin: '0',
        padding: '0',
        height: '100px',
        width: '100px',
        borderRadius: '50%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        // backgroundImage: './cuteBackground/magic-circle.png',
        backgroundColor: 'red',
    }
}

export default Wheel;


