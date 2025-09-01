import { Trend, Rate, Counter } from "k6/metrics";

export const addToCartDuration = new Trend("addToCart_duration");
export const loginDuration = new Trend("login_duration");
export const homepageDuration = new Trend("homepage_duration");
export const removeFromCartDuration = new Trend("removeFromCart_duration");
export const addToCartFailures = new Rate("addToCart_failures");
export const loginFailures = new Rate("login_failures");
export const removeFromCartFailures = new Rate("removeFromCart_failures");
export const homepageFailures = new Rate("homepage_failures");
export const addToCartErrors = new Counter("addToCart_errors");
export const loginErrors = new Counter("login_errors");
export const homepageErrors = new Counter("homepage_errors");
export const removeFromCartErrors = new Counter("removeFromCart_errors");

export const getCustomersFailures = new Rate("getCustomer_failures");
export const getCustomersDuration = new Trend("getCustomer_duration");
export const getCustomersErrors = new Counter("getCustomer_errors");
export const getCustomerByIdFailures = new Rate("getCustomerById_failures");
export const getCustomerByIdDuration = new Trend("getCustomerById_duration");
export const getCustomersByIdErrors = new Counter("getCustomerById_errors");
export const getBillingInfoFailures = new Rate("getBillingInfo_failures");
export const getBillingInfoDuration = new Trend("getBillingInfo_duration");
export const getBillingInfoErrors = new Counter("getBillingInfo_errors");
