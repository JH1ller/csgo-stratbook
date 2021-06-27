/* tslint:disable */
/* eslint-disable */
/**
 * csgo-stratbook api
 * Stratbook REST API
 *
 * The version of the OpenAPI document: 2.0.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { StrategyItemUserResponse } from './strategy-item-user-response';

/**
 * 
 * @export
 * @interface StrategyItemResponse
 */
export interface StrategyItemResponse {
    /**
     * 
     * @type {string}
     * @memberof StrategyItemResponse
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof StrategyItemResponse
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof StrategyItemResponse
     */
    note: string;
    /**
     * 
     * @type {string}
     * @memberof StrategyItemResponse
     */
    side: StrategyItemResponseSide;
    /**
     * 
     * @type {string}
     * @memberof StrategyItemResponse
     */
    type: StrategyItemResponseType;
    /**
     * 
     * @type {boolean}
     * @memberof StrategyItemResponse
     */
    active: boolean;
    /**
     * 
     * @type {string}
     * @memberof StrategyItemResponse
     */
    videoLink: string;
    /**
     * 
     * @type {boolean}
     * @memberof StrategyItemResponse
     */
    shared: boolean;
    /**
     * 
     * @type {string}
     * @memberof StrategyItemResponse
     */
    content: string;
    /**
     * 
     * @type {StrategyItemUserResponse}
     * @memberof StrategyItemResponse
     */
    modifiedBy: StrategyItemUserResponse;
    /**
     * 
     * @type {StrategyItemUserResponse}
     * @memberof StrategyItemResponse
     */
    createdBy: StrategyItemUserResponse;
    /**
     * 
     * @type {string}
     * @memberof StrategyItemResponse
     */
    createdAt: string;
    /**
     * 
     * @type {string}
     * @memberof StrategyItemResponse
     */
    modifiedAt: string;
}

/**
    * @export
    * @enum {string}
    */
export enum StrategyItemResponseSide {
    Ct = 'CT',
    T = 'T'
}
/**
    * @export
    * @enum {string}
    */
export enum StrategyItemResponseType {
    Pistol = 'PISTOL',
    Force = 'FORCE',
    Buyround = 'BUYROUND'
}



