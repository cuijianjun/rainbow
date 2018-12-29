'use strict';

const Controller = require('egg').Controller;

let http = require('http');
let createHandler = require('github-webhook-handler');
let spawn = require('child_process').spawn;


class DeployController extends Controller {

  constructor(ctx) {
    super(ctx);
    console.log('11111');
    this.handler = createHandler({ path: '/deploy', secret: 'Frank' });
    this._registerEvents();
  }

  _registerEvents() {
    this.handler.on('error', function (err) {
      console.error('Error:', err.message)
    });

    this.handler.on('push', function (event) {
      console.log('Received a push event for %s to %s',
        event.payload.repository.name,
        event.payload.ref);
      console.log(event);
    });
  }

  async rumCommand( cmd, args, cwd, callback ) {
    let child = spawn( cmd, args, {cwd: cwd} )
    let response = ''
    child.stdout.on('data', function( buffer ){ response += buffer.toString(); })
    child.stdout.on('end', function(){ callback( response ) })

  }
}

module.exports = DeployController;





