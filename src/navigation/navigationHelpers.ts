import { rootNavRef } from './rootNavRef';

export function navigateRestaurant(restaurantId: string) {
  rootNavRef.navigate('RestaurantDetail', { restaurantId });
}

export function navigateTrail(trailId: string) {
  rootNavRef.navigate('TrailDetail', { trailId });
}

export function navigateProfile(userId?: string) {
  rootNavRef.navigate('Profile', userId ? { userId } : undefined);
}

export function navigateCheckInFlow() {
  rootNavRef.navigate('CheckInFlow');
}
