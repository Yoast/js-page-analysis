// Internal dependencies.
import Worker from "./analysis.worker";
import { encodePayload, decodePayload } from "./utils";
import Request from "./request";

/**
 * Analysis worker is an API around the Web Worker.
 */
class AnalysisWorkerWrapper {
	/**
	 * Initializes the AnalysisWorkerWrapper class.
	 */
	constructor() {
		// Initialize instance variables.
		this._worker = new Worker();
		this._requests = {};
		this._autoIncrementedRequestId = -1;

		// Bind actions to this scope.
		this.initialize = this.initialize.bind( this );
		this.analyze = this.analyze.bind( this );

		// Bind event handlers to this scope.
		this.handleMessage = this.handleMessage.bind( this );
		this.handleMessageError = this.handleMessageError.bind( this );
		this.handleError = this.handleError.bind( this );

		// Initialize the worker event handlers.
		this._worker.onmessage = this.handleMessage;
		this._worker.onmessageerror = this.handleMessageError;
		this._worker.onerror = this.handleError;
	}

	/**
	 * Receives the messages and determines the action.
	 *
	 * See: https://developer.mozilla.org/en-US/docs/Web/API/Worker/onmessage
	 *
	 * @param {MessageEvent} event              The post message event.
	 * @param {Object}       event.data         The data object.
	 * @param {string}       event.data.type    The action type.
	 * @param {number}       event.data.id      The request id.
	 * @param {string}       event.data.payload The payload of the action.
	 *
	 * @returns {void}
	 */
	handleMessage( { data: { type, id, payload } } ) {
		let response, request;
		console.log( "wrapper", type, id, payload );

		switch( type ) {
			case "initialize:done":
				response = decodePayload( payload );
				request = this._requests[ id ];
				if ( ! request ) {
					console.warn( "AnalysisWorker: unmatched response", response );
					break;
				}

				request.resolve( response );
				break;
			case "analyze:done":
				response = decodePayload( payload );
				request = this._requests[ id ];
				if ( ! request ) {
					console.warn( "AnalysisWorker: unmatched response", response );
					break;
				}

				request.resolve( response );
				break;
			default:
				console.warn( "AnalysisWorker: unrecognized action", type );
		}
	}

	/**
	 * Receives the message errors.
	 *
	 * See: https://developer.mozilla.org/en-US/docs/Web/Events/messageerror
	 *
	 * @param {MessageEvent} event The message event for the error that
	 *                             occurred.
	 *
	 * @returns {void}
	 */
	handleMessageError( event ) {
		console.warn( "AnalysisWorker message error:", event );
	}

	/**
	 * Receives the errors.
	 *
	 * See:
	 * https://developer.mozilla.org/en-US/docs/Web/API/AbstractWorker/onerror
	 *
	 * @param {Error} event The error event.
	 *
	 * @returns {void}
	 */
	handleError( event ) {
		console.error( "AnalysisWorker error:", event );
	}

	/**
	 * Increments the request id.
	 *
	 * @returns {number} The incremented id.
	 */
	createRequestId() {
		this._autoIncrementedRequestId++;
		return this._autoIncrementedRequestId;
	}

	/**
	 * Creates a new request inside a Promise.
	 *
	 * @param {number} id The request id.
	 *
	 * @returns {Promise} The callback promise.
	 */
	createRequestPromise( id ) {
		return new Promise( ( resolve, reject ) => {
			this._requests[ id ] = new Request( resolve, reject );
		} );
	}

	/**
	 * Sends a message to the worker.
	 *
	 * @param {string} type      The message type.
	 * @param {number} id        The request id.
	 * @param {Object} [payload] The payload to deliver.
	 *
	 * @returns {void}
	 */
	send( type, id, payload = {} ) {
		console.log( "wrapper => worker", type, id, payload );
		this._worker.postMessage( {
			type,
			id,
			payload: encodePayload( payload ),
		} );
	}

	/**
	 * Initializes the worker with a configuration.
	 *
	 * @param {Object} configuration The configuration to initialize the worker
	 *                               with.
	 *
	 * @returns {Promise} The promise of initialization.
	 */
	initialize( configuration ) {
		const id = this.createRequestId();
		const promise = this.createRequestPromise( id );

		this.send( "initialize", id, configuration );
		return promise;
	}

	/**
	 * Analyzes the paper.
	 *
	 * @param {Object} paper         The paper to analyze.
	 * @param {Object} configuration The configuration specific to these analyses.
	 *
	 * @returns {Promise} The promise of analyses.
	 */
	analyze( paper, configuration = {} ) {
		const id = this.createRequestId();
		const promise = this.createRequestPromise( id );

		this.send( "analyze", id, { paper, configuration } );
		return promise;
	}
}

export default AnalysisWorkerWrapper;