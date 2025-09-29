// Services folder - Add your service files here

// Export Auth services
export {
  loginUser,
  registerUser,
  logoutUserAPI,
  storeAuthToken,
  getAuthToken,
  removeAuthToken,
  isAuthenticated,
  logoutUser,
  logoutUserLocal,
  extendSession,
  getRemainingSessionTime,
  AuthError,
  initiateGoogleLogin,
  handleGoogleLogin,
  refreshAccessToken,
  storeRefreshToken,
  getRefreshToken,
  removeRefreshToken,
  ensureValidToken
} from './Auth'

// Export User services
export {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  getSellerProfile,
} from './User'

// Export Battery services
export {
  getBatteries,
  getBatteryById
} from './Battery'

// Export Vehicle services
export {
  getVehicles,
  getVehicleById
} from './Vehicle'

// Export types
export type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
  LogoutResponse,
  ApiError
} from './Auth'

export type {
  User,
  UserProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  SellerProfile,
  SellerProfileResponse,
  Review,
  VerifiedSeller,
  VerifiedSellersResponse
} from './User'

export type {
  Battery,
  BatteriesResponse
} from './Battery'

export type {
  Vehicle,
  VehiclesResponse,
  VehicleResponse
} from './Vehicle'