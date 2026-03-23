export type RootStackParamList = {
  MainTabs: undefined;
  Profile: { userId?: string } | undefined;
  RestaurantDetail: { restaurantId: string };
  TrailDetail: { trailId: string };
  CheckInFlow: undefined;
};

export type MainTabParamList = {
  Journal: undefined;
  Explore: undefined;
  CheckIn: undefined;
  Trails: undefined;
  Activity: undefined;
};
