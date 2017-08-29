import 'isomorphic-fetch';
import DataLoader from 'dataloader';

import {
  wayfGet,
  wayfPost, 
  wayfPut,
  wayfPatch,
  wayfDelete,
  buildDeviceCookieHeader,
  buildAuthorizationApiHeader
} from './WayfCloud';

export var publisherLoader = new DataLoader(keys => fetchPublishers(keys));
export var identityProviderLoader = new DataLoader(keys => fetchIdentityProviders(keys));
export var userLoader = new DataLoader(keys => fetchUsers(keys));

export class User {
  constructor(secretDeviceId, adminToken) {
    this.secretDeviceId = secretDeviceId;
    this.adminToken = adminToken;
  }
}

export function getAdminViewer() {
  return new User();
}

export function getViewer(deviceId, adminToken) {
  return new User(deviceId, adminToken);
}

export function fetchMe(adminToken) {
  return wayfGet('/1/me', buildAuthorizationApiHeader(adminToken, null)).catch(err => { return {}; });
}

export function fetchDevice(deviceId) {
  return wayfGet('/1/mydevice', buildDeviceCookieHeader(deviceId, null));
}

export function fetchIdentityProvider(id) {
  return wayfGet(`/1/identityProvider/${id}`, null);
}

function fetchIdentityProviders(ids) {
  return wayfGet(`/1/identityProviders?ids=${ids}`, null);
}


export function fetchPublisher(id) {
  return wayfGet(`/1/publisher/${id}`, null);
}

function fetchPublishers(id) {
  return wayfGet(`/1/publishers?ids=${id}`, null);
}

export function fetchActivity(deviceId) {
  return wayfGet('/1/mydevice/activity', buildDeviceCookieHeader(deviceId, null));
}

export function fetchLatestActivity(deviceId) {
  return wayfGet('/1/mydevice/activity?limit=1&type=ADD_IDP', buildDeviceCookieHeader(deviceId, null))
      .then(function(res) {
        var activity = res;

        return activity[0];
      });
}

export function fetchHistory(deviceId) {
  return wayfGet('/1/mydevice/history', buildDeviceCookieHeader(deviceId, null));
}

export function forgetIdp(idpId, deviceId) {
  return wayfDelete(`/1/mydevice/history/idp/${idpId}`, buildDeviceCookieHeader(deviceId, null))
    .then(() => getViewer());
}

export function createPublisherRegistration(publisherRegistration) {
  return wayfPost('/1/publisherRegistration', publisherRegistration, null);
}

export function createPublisher(publisher, adminToken) {
  return wayfPost('/1/publisher', publisher, buildAuthorizationApiHeader(adminToken, null));
}

export function adminLogin(credentials) {
  return wayfPost('/1/user/credentials', credentials, null);
}

export function fetchPendingRegistrations(adminToken) {
  return wayfGet(`/1/publisherRegistrations?statuses=PENDING`, buildAuthorizationApiHeader(adminToken, null));
}

export function fetchApprovedRegistrations(adminToken) {
  return wayfGet(`/1/publisherRegistrations?statuses=APPROVED`, buildAuthorizationApiHeader(adminToken, null));
}

export function fetchDeniedRegistrations(adminToken) {
  return wayfGet(`/1/publisherRegistrations?statuses=DENIED`, buildAuthorizationApiHeader(adminToken, null));
}

export function fetchAdminUsers(adminToken) {
  return wayfGet(`/1/users?view=ADMIN`, buildAuthorizationApiHeader(adminToken, null));
}

export function createUser(user, adminToken) {
  return wayfPost(`/1/user`, user, buildAuthorizationApiHeader(adminToken, null));
}

export function fetchUsers(ids) {
  return wayfGet(`/1/users?ids=${ids}`, null);
}

export function denyPublisherRegistration(publisherRegistrationId, adminToken) {
  var body = {
    id: publisherRegistrationId,
    status: 'DENIED'
  };

  return wayfPatch(`/1/publisherRegistration/${publisherRegistrationId}`, body, buildAuthorizationApiHeader(adminToken, null));
}

export function deleteUser(userId, adminToken) {
  return wayfDelete(`/1/user/${userId}`, buildAuthorizationApiHeader(adminToken, null));
}

export function resetUserPassword(credentials, userId, adminToken) {
  return wayfPut(`/1/user/${userId}/credentials`, credentials, buildAuthorizationApiHeader(adminToken, null));
}