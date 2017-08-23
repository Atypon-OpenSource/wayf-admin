import 'isomorphic-fetch';
import DataLoader from 'dataloader';
import config from '../../config';

const BASE_URL = config.wayf.host + ':' + config.wayf.port;


export var publisherLoader = new DataLoader(keys => fetchPublishers(keys));
export var identityProviderLoader = new DataLoader(keys => fetchIdentityProviders(keys));
export var userLoader = new DataLoader(keys => fetchUsers(keys));

export class User {
  constructor(secretDeviceId, adminToken) {
    this.secretDeviceId = secretDeviceId;
    this.adminToken = adminToken;
  }
}

function buildDeviceCookieHeader(deviceId) {
  return { Cookie: `deviceId=${deviceId}` };
}

function buildAuthorizationApiHeader(token) {
  return { Authorization: `${token}` };
}

export function getAdminViewer() {
  return new User();
}

export function getViewer(deviceId, adminToken) {
  console.log(`deviceId ${deviceId}`);
  return new User(deviceId, adminToken);
}

function fetchResponseByURL(relativeURL) {
  console.log(`${BASE_URL}${relativeURL}`);
  return fetch(`${BASE_URL}${relativeURL}`).then(res => res.json());
}

function postToCloud(body, relativeURL) {
  return fetch(`${BASE_URL}${relativeURL}`, { method: 'POST', body: JSON.stringify(body) })
    .then(function(res) {
        return res.json();
    });
}

function patchToCloud(body, relativeURL, adminToken) {
  var headers = null;
  if (adminToken) {
    headers = buildAuthorizationApiHeader(adminToken)
  }

  return fetch(`${BASE_URL}${relativeURL}`, { method: 'PATCH', headers: headers, body: JSON.stringify(body) })
    .then(function(res) {
        return res.json();
    });
}

function deleteByURLAndHeader(relativeURL, header) {
  console.log(relativeURL, header);

  return fetch(`${BASE_URL}${relativeURL}`, { headers: header, method: 'delete' }).then(res => res.json());
}

function fetchResponseByURLAndHeader(relativeURL, header) {
  console.log(relativeURL, header);

  return fetch(`${BASE_URL}${relativeURL}`, { headers: header }).then(res => res.json());
}

export function fetchMe(adminToken) {
  return fetchResponseByURLAndHeader('/1/me', buildAuthorizationApiHeader(adminToken));
}

export function fetchDevice(deviceId) {
  return fetchResponseByURLAndHeader('/1/mydevice', buildDeviceCookieHeader(deviceId));
}

export function fetchIdentityProvider(id) {
  return fetchResponseByURL(`/1/identityProvider/${id}`);
}

function fetchIdentityProviders(ids) {
  return fetchResponseByURL(`/1/identityProviders?ids=${ids}`);
}


export function fetchPublisher(id) {
  return fetchResponseByURL(`/1/publisher/${id}`);
}

function fetchPublishers(id) {
  return fetchResponseByURL(`/1/publishers?ids=${id}`);
}

export function fetchActivity(deviceId) {
  return fetchResponseByURLAndHeader('/1/mydevice/activity', buildDeviceCookieHeader(deviceId));
}

export function fetchLatestActivity(deviceId) {
  return fetchResponseByURLAndHeader('/1/mydevice/activity?limit=1&type=ADD_IDP', buildDeviceCookieHeader(deviceId))
      .then(function(res) {
        var activity = res;

        return activity[0];
      });
}

export function fetchHistory(deviceId) {
  return fetchResponseByURLAndHeader('/1/mydevice/history', buildDeviceCookieHeader(deviceId));
}

export function forgetIdp(idpId, deviceId) {
  return deleteByURLAndHeader(`/1/mydevice/history/idp/${idpId}`, buildDeviceCookieHeader(deviceId)).then(() => getViewer());
}

export function createPublisherRegistration(publisherRegistration) {
  return postToCloud(publisherRegistration, '/1/publisherRegistration');
}

export function createPublisher(publisher) {
  return postToCloud(publisher, '/1/publisher');
}

export function adminLogin(credentials) {
  return postToCloud(credentials, '/1/user/credentials');
}

export function fetchPendingRegistrations(adminToken) {
  return fetchResponseByURLAndHeader(`/1/publisherRegistrations?statuses=PENDING`, buildAuthorizationApiHeader(adminToken));
}

export function fetchApprovedRegistrations(adminToken) {
  return fetchResponseByURLAndHeader(`/1/publisherRegistrations?statuses=APPROVED`, buildAuthorizationApiHeader(adminToken));
}

export function fetchDeniedRegistrations(adminToken) {
  return fetchResponseByURLAndHeader(`/1/publisherRegistrations?statuses=DENIED`, buildAuthorizationApiHeader(adminToken));
}

export function fetchUsers(ids) {
  return fetchResponseByURL(`/1/users?ids=${ids}`);
}

export function denyPublisherRegistration(publisherRegistrationId, adminToken) {
  var body = {
    id: publisherRegistrationId,
    status: 'DENIED'
  };

  return patchToCloud(body, `/1/publisherRegistration/${publisherRegistrationId}`, adminToken);
}