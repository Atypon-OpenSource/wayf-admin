import config from '../../config';

const BASE_URL = config.wayf.host + ':' + config.wayf.port;

const HTTP_METHODS = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	PATCH: 'PATCH',
	DELETE: 'DELETE'
}


export function buildDeviceCookieHeader(deviceId, headers) {
	if (!headers) {
		headers = {};
	}

	headers.Cookie = `deviceId=${deviceId}`;

	return headers;
}

export function buildAuthorizationApiHeader(token, headers) {
	if (!headers) {
		headers = {};
	}

  	headers.Authorization = `${token}`;

  	return headers;
}


function executeRequest(httpMethod, relativeUrl, requestBody, headers) {
	var options = {
		method: httpMethod,
		headers: headers,
		body: requestBody? JSON.stringify(requestBody): null
	};

	return fetch(`${BASE_URL}${relativeUrl}`, options)
			.then(response => {
				if (!response.ok) {
					throw new Error(response.status);
				}


				return response.json().catch(err => { return {}; });
			})
}


export function wayfGet(relativeUrl, headers) {
    return executeRequest(HTTP_METHODS.GET, relativeUrl, null, headers);
}

export function wayfPost(relativeUrl, body, headers) {
	return executeRequest(HTTP_METHODS.POST, relativeUrl, body, headers);
}

export function wayfPut(relativeUrl, body, headers) {
	return executeRequest(HTTP_METHODS.PUT, relativeUrl, body, headers);
}

export function wayfPatch(relativeUrl, body, headers) {
	return executeRequest(HTTP_METHODS.PATCH, relativeUrl, body, headers);
}

export function wayfDelete(relativeUrl, headers) {
    return executeRequest(HTTP_METHODS.DELETE, relativeUrl, null, headers);
}