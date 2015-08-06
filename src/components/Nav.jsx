/**
 * Copyright 2014, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';
var React = require('react');
var Link = require('react-router').Link;

var Nav = React.createClass({
    contextTypes: {
        router: React.PropTypes.func.isRequired
    },
    render: function() {
        return (
            <ul className="pure-menu pure-menu-open pure-menu-horizontal">
                <li className={this.context.router.isActive('/') ? 'pure-menu-selected' : ''}><Link to='/'>Index</Link></li>
                <li className={this.context.router.isActive('/manage') ? 'pure-menu-selected' : ''}><Link to='/manage'>Manage</Link></li>
                <li className={this.context.router.isActive('/demo') ? 'pure-menu-selected' : ''}><Link to='/demo'>Demo</Link></li>
           </ul>
        );
    }
});

module.exports = Nav;
