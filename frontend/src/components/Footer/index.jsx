import React from 'react';
import * as PropTypes from 'prop-types';
import './style.less';

class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.refFooter = () => (el) => {
            const elFooterHeight = el?.offsetHeight;
            const stageScrollTop = document.querySelector('.stage').scrollTop;

            const { footerHeight, stageScroll } = this.props.ui

            if (el && footerHeight !== elFooterHeight) {
                this.props.ui_SetFooterHeight(elFooterHeight);
            }

            if (stageScrollTop !== stageScroll) {
                this.props.ui_SetStageScrollTop(stageScrollTop);
            }
        };
    }

    render() {
        return (
            <footer
                ref={this.refFooter()}
                className="app-footer no-print"
                style={{
                    background: '#FFF',
                    borderColor: '#DDD',
                    padding: 2,
                }}
            >
                <div className="container">
                    <strong>Acquired Conditions App</strong>
                    &nbsp;&copy;&nbsp;
                    <a
                        href="#"
                        rel="noopener noreferrer"
                        target="_blank"
                        style={{ color: '#000' }}
                    >
                        Quadrant Health
                    </a>
                    &nbsp;2021
                </div>
            </footer>
        );
    }
}
Footer.propTypes = {
    ui: PropTypes.object.isRequired,
    ui_SetFooterHeight: PropTypes.func.isRequired,
    ui_SetStageScrollTop: PropTypes.func.isRequired,
};
export default Footer;
