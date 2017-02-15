import Inferno from 'inferno';
import Component from 'inferno-component';

export default class Home extends Component {
    render() {
        return <div>
            param is {this.props.params.param}
        </div>;
    }
}

