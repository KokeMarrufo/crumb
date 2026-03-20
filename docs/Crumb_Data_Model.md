**Crumb**

*Database Schema & Data Model*

Supabase / PostgreSQL • v1.0 • March 2026

**Legend**

  ----------------- ------------------
  **Red / Bold**    Primary Key (PK)
  **Blue / Bold**   Foreign Key (FK)
  Green mono        Data type
  ----------------- ------------------

**Tables**

**1. users**

*ℹ️ Core user profile. The is\_private and requires\_follow\_approval
flags drive the entire privacy model.*

  ---------------------------- ------------- -------------- ----------------------------------------------------------
  **Column**                   **Type**      **Nullable**   **Notes**
  **id**                       uuid          no             PK --- auto-generated
  username                     text          no             Unique. Used for search and profile URLs
  full\_name                   text          no             
  avatar\_url                  text          yes            Points to Cloudflare R2 or Supabase Storage
  bio                          text          yes            Short profile description
  is\_private                  boolean       no             Default false. If true, only followers can see content
  requires\_follow\_approval   boolean       no             Default false. If true, follow requests must be approved
  created\_at                  timestamptz   no             Auto-set on insert
  ---------------------------- ------------- -------------- ----------------------------------------------------------

**2. follows**

*ℹ️ Handles follow relationships. Status field supports both open
follows and approval-required flows in a single table.*

  ------------------- ------------- -------------- ----------------------------------------------------------------
  **Column**          **Type**      **Nullable**   **Notes**
  **id**              uuid          no             PK
  **follower\_id**    uuid          no             FK → users.id --- the person following
  **following\_id**   uuid          no             FK → users.id --- the person being followed
  status              text          no             \'pending\' or \'accepted\'. Open follows auto-set to accepted
  created\_at         timestamptz   no             Auto-set on insert
  ------------------- ------------- -------------- ----------------------------------------------------------------

**3. blocks**

*ℹ️ Safety table. Blocked users cannot see your profile, check-ins, or
Trails. Enforced via Row Level Security in Supabase.*

  ----------------- ------------- -------------- ------------------------------------------
  **Column**        **Type**      **Nullable**   **Notes**
  **id**            uuid          no             PK
  **blocker\_id**   uuid          no             FK → users.id --- the user blocking
  **blocked\_id**   uuid          no             FK → users.id --- the user being blocked
  created\_at       timestamptz   no             Auto-set on insert
  ----------------- ------------- -------------- ------------------------------------------

**4. restaurants**

*ℹ️ Local cache of Google Places API data. Every location has a unique
place\_id from Google --- this naturally handles franchises (Paris
McDonald\'s vs LA McDonald\'s are separate records).*

  -------------- ------------- -------------- ---------------------------------------------------------------
  **Column**     **Type**      **Nullable**   **Notes**
  **id**         uuid          no             PK
  place\_id      text          no             Unique. Google Places ID --- the source of truth for identity
  name           text          no             Restaurant name from Google Places
  address        text          yes            Formatted address
  city           text          yes            Extracted for filtering and display
  country        text          yes            Extracted for filtering and display
  lat            float8        yes            Latitude --- enables geospatial queries via PostGIS
  lng            float8        yes            Longitude
  google\_data   jsonb         yes            Full Places API response blob --- flexible for future fields
  created\_at    timestamptz   no             Auto-set on insert
  -------------- ------------- -------------- ---------------------------------------------------------------

**5. checkins**

*ℹ️ The heart of Crumb. visited\_at is separate from created\_at to
support remote check-ins --- a user can log a meal they had 6 months
ago. computed\_rating is auto-averaged from dish ratings; user\_rating
is manually set.*

  -------------------- ------------- -------------- -------------------------------------------------------------------------------------------------
  **Column**           **Type**      **Nullable**   **Notes**
  **id**               uuid          no             PK
  **user\_id**         uuid          no             FK → users.id
  **restaurant\_id**   uuid          no             FK → restaurants.id
  visited\_at          timestamptz   no             When the user actually visited. Can be in the past
  notes                text          yes            Free text about the experience
  user\_rating         int2          yes            1-5 stars, manually set by the user
  computed\_rating     float4        yes            Auto-averaged from checkin\_dishes ratings. App suggests this, user can override
  is\_remote           boolean       no             Default false. True when logged away from the restaurant location
  private\_note        text          yes            Private Reflection --- only visible to the author. Never exposed via public API or RLS policies
  created\_at          timestamptz   no             Auto-set on insert
  -------------------- ------------- -------------- -------------------------------------------------------------------------------------------------

**6. checkin\_photos**

*ℹ️ Photos are stored separately to keep checkins lean and support
multiple photos per visit. The order field lets users control photo
sequence.*

  ----------------- ------------- -------------- -----------------------------------------------
  **Column**        **Type**      **Nullable**   **Notes**
  **id**            uuid          no             PK
  **checkin\_id**   uuid          no             FK → checkins.id
  url               text          no             Cloudflare R2 or Supabase Storage URL
  order             int2          no             Display order within the check-in (0-indexed)
  created\_at       timestamptz   no             Auto-set on insert
  ----------------- ------------- -------------- -----------------------------------------------

**7. checkin\_dishes**

*ℹ️ Each dish gets its own rating (1-5). The average of all dish ratings
is used to compute the checkins.computed\_rating. Future potential:
surface most-loved dishes per restaurant across all users.*

  ----------------- ------------- -------------- ---------------------------------------------------------------
  **Column**        **Type**      **Nullable**   **Notes**
  **id**            uuid          no             PK
  **checkin\_id**   uuid          no             FK → checkins.id
  name              text          no             Dish name (e.g. Tacos al Pastor)
  notes             text          yes            Optional description or thoughts on the dish
  rating            int2          yes            1-5 stars per dish. Optional --- user may not rate every dish
  created\_at       timestamptz   no             Auto-set on insert
  ----------------- ------------- -------------- ---------------------------------------------------------------

**8. trails**

*ℹ️ A Trail is a curated list of restaurants backed by real check-in
experiences. Public Trails are visible on the user\'s profile. Future:
multiple Trails per user with different themes.*

  -------------- ------------- -------------- -----------------------------------------------------
  **Column**     **Type**      **Nullable**   **Notes**
  **id**         uuid          no             PK
  **user\_id**   uuid          no             FK → users.id
  name           text          no             e.g. My Top 10, Best Tacos, Date Night Spots
  description    text          yes            Optional context for the Trail
  is\_public     boolean       no             Default true. Respects parent user privacy settings
  created\_at    timestamptz   no             Auto-set on insert
  -------------- ------------- -------------- -----------------------------------------------------

**9. trail\_items**

*ℹ️ The checkin\_id is the key field here --- it links each Trail entry
to the specific check-in that earned that restaurant its spot. This
powers the \'tap to see why it made the list\' feature.*

  -------------------- ------------- -------------- -------------------------------------------------------------------------------------------------------
  **Column**           **Type**      **Nullable**   **Notes**
  **id**               uuid          no             PK
  **trail\_id**        uuid          no             FK → trails.id
  **restaurant\_id**   uuid          no             FK → restaurants.id
  **checkin\_id**      uuid          yes            FK → checkins.id --- the experience backing this entry. Nullable in case user adds without a check-in
  rank                 int2          no             User-defined order within the Trail. 1 = top spot
  created\_at          timestamptz   no             Auto-set on insert
  -------------------- ------------- -------------- -------------------------------------------------------------------------------------------------------

**10. likes**

*ℹ️ Lowest friction engagement. One row per like. Enables like counts on
check-ins and like notifications. Simple to build, essential for making
the feed feel social.*

  ----------------- ------------- -------------- --------------------------------------------------
  **Column**        **Type**      **Nullable**   **Notes**
  **id**            uuid          no             PK
  **user\_id**      uuid          no             FK → users.id --- the user who liked
  **checkin\_id**   uuid          no             FK → checkins.id --- the check-in that was liked
  created\_at       timestamptz   no             Auto-set on insert
  ----------------- ------------- -------------- --------------------------------------------------

**11. comments**

*ℹ️ Completes the social loop. Users can respond to each other\'s
Crumbs. Drives re-engagement and keeps the feed feeling alive and
conversational.*

  ----------------- ------------- -------------- ------------------------------------------------------
  **Column**        **Type**      **Nullable**   **Notes**
  **id**            uuid          no             PK
  **user\_id**      uuid          no             FK → users.id --- the commenter
  **checkin\_id**   uuid          no             FK → checkins.id --- the check-in being commented on
  body              text          no             The comment text
  created\_at       timestamptz   no             Auto-set on insert
  ----------------- ------------- -------------- ------------------------------------------------------

**12. notifications**

*ℹ️ Keeps the social layer feeling alive. The entity\_id and
entity\_type pattern is flexible --- a notification can point to a
check-in, a follow request, or any future entity type.*

  --------------- ------------- -------------- -----------------------------------------------------------------------------------------------------------------------------------------------
  **Column**      **Type**      **Nullable**   **Notes**
  **id**          uuid          no             PK
  **user\_id**    uuid          no             FK → users.id --- the recipient
  **actor\_id**   uuid          no             FK → users.id --- who triggered the notification
  type            text          no             \'new\_follower\' \| \'follow\_request\' \| \'follow\_approved\' \| \'friend\_checkin\_at\_your\_place\' \| \'new\_like\' \| \'new\_comment\'
  entity\_id      uuid          yes            ID of the related entity (checkin, trail, etc.)
  entity\_type    text          yes            \'checkin\' \| \'trail\' \| \'follow\' --- tells the app what to navigate to on tap
  is\_read        boolean       no             Default false
  created\_at     timestamptz   no             Auto-set on insert
  --------------- ------------- -------------- -----------------------------------------------------------------------------------------------------------------------------------------------

**Key Relationships**

  ------------------ --------------------- ---------------------------------------------------------
  **From**           **To**                **Description**
  **users**          **follows**           A user can follow many users (one-directional)
  **users**          **blocks**            A user can block many users
  **users**          **checkins**          A user has many check-ins
  **checkins**       **restaurants**       A check-in belongs to one restaurant
  **checkins**       **checkin\_photos**   A check-in has many photos
  **checkins**       **checkin\_dishes**   A check-in has many dishes, each with its own rating
  **users**          **trails**            A user has many Trails
  **trails**         **trail\_items**      A Trail has many items (restaurants)
  **trail\_items**   **checkins**          Each Trail item optionally links to a specific check-in
  **users**          **notifications**     A user receives many notifications
  **users**          **likes**             A user can like many check-ins
  **checkins**       **likes**             A check-in can have many likes
  **users**          **comments**          A user can comment on many check-ins
  **checkins**       **comments**          A check-in can have many comments
  ------------------ --------------------- ---------------------------------------------------------

**Key Design Decisions**

  -------------------------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  **Decision**                     **Reasoning**
  **visited\_at vs created\_at**   Enables remote check-ins. Users can log past meals using existing phone photos without being physically at the restaurant.
  **Dual rating fields**           computed\_rating averages dish ratings automatically. user\_rating is the manual override. App suggests the computed value --- user decides the final score.
  **place\_id from Google**        Google assigns a unique place\_id to every location in the world. The Paris McDonald\'s and LA McDonald\'s are naturally distinct records. No custom logic needed.
  **restaurants as a cache**       Storing Places API data locally avoids repeated API calls and reduces cost. First check-in to a place writes to restaurants. All subsequent check-ins reuse that row.
  **trail\_items.checkin\_id**     Links a Trail entry to the actual experience that earned it the spot. Powers the \'tap to see why\' feature. Nullable so users can add a restaurant to a Trail before they have a check-in there.
  **Row Level Security**           Supabase RLS enforces privacy and block rules at the database level. Private profile content and blocked user content is invisible by policy --- not just hidden in the UI.
  **private\_note**                The Private Reflection field. Stored on the checkins table but never returned by public-facing queries. RLS ensures only the author can ever read this column.
  **likes as a table**             One row per like rather than a counter column. This allows you to know exactly who liked a Crumb, prevent duplicate likes, and easily generate notifications --- all from a single table.
  -------------------------------- ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

*Crumb --- Confidential. 12 tables. Infinite meals.*
