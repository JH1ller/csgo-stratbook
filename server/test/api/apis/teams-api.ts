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


import globalAxios, { AxiosPromise, AxiosInstance } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
// @ts-ignore
import { DeleteTeamDto } from '../models';
// @ts-ignore
import { GetTeamResponse } from '../models';
// @ts-ignore
import { JoinTeamDto } from '../models';
/**
 * TeamsApi - axios parameter creator
 * @export
 */
export const TeamsApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {string} name 
         * @param {string} website 
         * @param {string} serverIp 
         * @param {string} serverPassword 
         * @param {any} [avatar] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        teamsControllerCreateTeam: async (name: string, website: string, serverIp: string, serverPassword: string, avatar?: any, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'name' is not null or undefined
            assertParamExists('teamsControllerCreateTeam', 'name', name)
            // verify required parameter 'website' is not null or undefined
            assertParamExists('teamsControllerCreateTeam', 'website', website)
            // verify required parameter 'serverIp' is not null or undefined
            assertParamExists('teamsControllerCreateTeam', 'serverIp', serverIp)
            // verify required parameter 'serverPassword' is not null or undefined
            assertParamExists('teamsControllerCreateTeam', 'serverPassword', serverPassword)
            const localVarPath = `/api/teams/create`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;
            const localVarFormParams = new ((configuration && configuration.formDataCtor) || FormData)();


            if (name !== undefined) { 
                localVarFormParams.append('name', name as any);
            }
    
            if (website !== undefined) { 
                localVarFormParams.append('website', website as any);
            }
    
            if (serverIp !== undefined) { 
                localVarFormParams.append('serverIp', serverIp as any);
            }
    
            if (serverPassword !== undefined) { 
                localVarFormParams.append('serverPassword', serverPassword as any);
            }
    
            if (avatar !== undefined) { 
                localVarFormParams.append('avatar', avatar as any);
            }
    
    
            localVarHeaderParameter['Content-Type'] = 'multipart/form-data';
    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = localVarFormParams;

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {DeleteTeamDto} deleteTeamDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        teamsControllerDeleteTeam: async (deleteTeamDto: DeleteTeamDto, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'deleteTeamDto' is not null or undefined
            assertParamExists('teamsControllerDeleteTeam', 'deleteTeamDto', deleteTeamDto)
            const localVarPath = `/api/teams/delete`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(deleteTeamDto, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        teamsControllerGetPlayers: async (options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/teams/players`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        teamsControllerGetTeamInfo: async (options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/teams`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {JoinTeamDto} joinTeamDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        teamsControllerJoinTeam: async (joinTeamDto: JoinTeamDto, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'joinTeamDto' is not null or undefined
            assertParamExists('teamsControllerJoinTeam', 'joinTeamDto', joinTeamDto)
            const localVarPath = `/api/teams/join`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PATCH', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(joinTeamDto, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        teamsControllerLeaveTeam: async (options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/teams/leave`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PATCH', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * TeamsApi - functional programming interface
 * @export
 */
export const TeamsApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = TeamsApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {string} name 
         * @param {string} website 
         * @param {string} serverIp 
         * @param {string} serverPassword 
         * @param {any} [avatar] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async teamsControllerCreateTeam(name: string, website: string, serverIp: string, serverPassword: string, avatar?: any, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.teamsControllerCreateTeam(name, website, serverIp, serverPassword, avatar, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {DeleteTeamDto} deleteTeamDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async teamsControllerDeleteTeam(deleteTeamDto: DeleteTeamDto, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.teamsControllerDeleteTeam(deleteTeamDto, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async teamsControllerGetPlayers(options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.teamsControllerGetPlayers(options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async teamsControllerGetTeamInfo(options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<GetTeamResponse>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.teamsControllerGetTeamInfo(options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {JoinTeamDto} joinTeamDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async teamsControllerJoinTeam(joinTeamDto: JoinTeamDto, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.teamsControllerJoinTeam(joinTeamDto, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async teamsControllerLeaveTeam(options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.teamsControllerLeaveTeam(options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * TeamsApi - factory interface
 * @export
 */
export const TeamsApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = TeamsApiFp(configuration)
    return {
        /**
         * 
         * @param {string} name 
         * @param {string} website 
         * @param {string} serverIp 
         * @param {string} serverPassword 
         * @param {any} [avatar] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        teamsControllerCreateTeam(name: string, website: string, serverIp: string, serverPassword: string, avatar?: any, options?: any): AxiosPromise<void> {
            return localVarFp.teamsControllerCreateTeam(name, website, serverIp, serverPassword, avatar, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {DeleteTeamDto} deleteTeamDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        teamsControllerDeleteTeam(deleteTeamDto: DeleteTeamDto, options?: any): AxiosPromise<void> {
            return localVarFp.teamsControllerDeleteTeam(deleteTeamDto, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        teamsControllerGetPlayers(options?: any): AxiosPromise<void> {
            return localVarFp.teamsControllerGetPlayers(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        teamsControllerGetTeamInfo(options?: any): AxiosPromise<GetTeamResponse> {
            return localVarFp.teamsControllerGetTeamInfo(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {JoinTeamDto} joinTeamDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        teamsControllerJoinTeam(joinTeamDto: JoinTeamDto, options?: any): AxiosPromise<void> {
            return localVarFp.teamsControllerJoinTeam(joinTeamDto, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        teamsControllerLeaveTeam(options?: any): AxiosPromise<void> {
            return localVarFp.teamsControllerLeaveTeam(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for teamsControllerCreateTeam operation in TeamsApi.
 * @export
 * @interface TeamsApiTeamsControllerCreateTeamRequest
 */
export interface TeamsApiTeamsControllerCreateTeamRequest {
    /**
     * 
     * @type {string}
     * @memberof TeamsApiTeamsControllerCreateTeam
     */
    readonly name: string

    /**
     * 
     * @type {string}
     * @memberof TeamsApiTeamsControllerCreateTeam
     */
    readonly website: string

    /**
     * 
     * @type {string}
     * @memberof TeamsApiTeamsControllerCreateTeam
     */
    readonly serverIp: string

    /**
     * 
     * @type {string}
     * @memberof TeamsApiTeamsControllerCreateTeam
     */
    readonly serverPassword: string

    /**
     * 
     * @type {any}
     * @memberof TeamsApiTeamsControllerCreateTeam
     */
    readonly avatar?: any
}

/**
 * Request parameters for teamsControllerDeleteTeam operation in TeamsApi.
 * @export
 * @interface TeamsApiTeamsControllerDeleteTeamRequest
 */
export interface TeamsApiTeamsControllerDeleteTeamRequest {
    /**
     * 
     * @type {DeleteTeamDto}
     * @memberof TeamsApiTeamsControllerDeleteTeam
     */
    readonly deleteTeamDto: DeleteTeamDto
}

/**
 * Request parameters for teamsControllerJoinTeam operation in TeamsApi.
 * @export
 * @interface TeamsApiTeamsControllerJoinTeamRequest
 */
export interface TeamsApiTeamsControllerJoinTeamRequest {
    /**
     * 
     * @type {JoinTeamDto}
     * @memberof TeamsApiTeamsControllerJoinTeam
     */
    readonly joinTeamDto: JoinTeamDto
}

/**
 * TeamsApi - object-oriented interface
 * @export
 * @class TeamsApi
 * @extends {BaseAPI}
 */
export class TeamsApi extends BaseAPI {
    /**
     * 
     * @param {TeamsApiTeamsControllerCreateTeamRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TeamsApi
     */
    public teamsControllerCreateTeam(requestParameters: TeamsApiTeamsControllerCreateTeamRequest, options?: any) {
        return TeamsApiFp(this.configuration).teamsControllerCreateTeam(requestParameters.name, requestParameters.website, requestParameters.serverIp, requestParameters.serverPassword, requestParameters.avatar, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {TeamsApiTeamsControllerDeleteTeamRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TeamsApi
     */
    public teamsControllerDeleteTeam(requestParameters: TeamsApiTeamsControllerDeleteTeamRequest, options?: any) {
        return TeamsApiFp(this.configuration).teamsControllerDeleteTeam(requestParameters.deleteTeamDto, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TeamsApi
     */
    public teamsControllerGetPlayers(options?: any) {
        return TeamsApiFp(this.configuration).teamsControllerGetPlayers(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TeamsApi
     */
    public teamsControllerGetTeamInfo(options?: any) {
        return TeamsApiFp(this.configuration).teamsControllerGetTeamInfo(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {TeamsApiTeamsControllerJoinTeamRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TeamsApi
     */
    public teamsControllerJoinTeam(requestParameters: TeamsApiTeamsControllerJoinTeamRequest, options?: any) {
        return TeamsApiFp(this.configuration).teamsControllerJoinTeam(requestParameters.joinTeamDto, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof TeamsApi
     */
    public teamsControllerLeaveTeam(options?: any) {
        return TeamsApiFp(this.configuration).teamsControllerLeaveTeam(options).then((request) => request(this.axios, this.basePath));
    }
}
