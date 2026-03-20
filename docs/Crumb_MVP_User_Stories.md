**Crumb**

*Your food story. Shared.*

MVP User Stories • v1.0 • March 2026

**Overview**

Crumb is a social food journal where every check-in becomes a personal
memory and a trusted recommendation. Users log their dining experiences,
build curated restaurant lists called Trails, and discover places
through people they follow --- not strangers.

This document captures the MVP user stories --- the minimum set of
features that make Crumb feel like Crumb. Post-MVP features are listed
separately at the end.

**The Three Pillars of Crumb**

+----------------------+----------------------+----------------------+
| **Check-ins**        | **Feed**             | **Trails**           |
|                      |                      |                      |
| Your personal food   | Follow people you    | Curated restaurant   |
| memory. Log what you | trust. See their     | lists backed by your |
| ate, where, and      | crumbs in a social   | real experiences.    |
| when.                | feed.                |                      |
+----------------------+----------------------+----------------------+

**MVP User Stories (V1)**

**1. Authentication & Onboarding**

  ------------------------------------------------------------ -----------------------------------------------------
  **User Story**                                               **Notes**
  As a user I can sign up with my email and create a profile   *Name, username, profile photo*
  As a user I can log in and log out securely                  
  As a user I can set my profile to public or private          *Public = anyone can see; Private = followers only*
  As a user I can choose open follows or approval-required     *Controls who can follow without permission*
  ------------------------------------------------------------ -----------------------------------------------------

**2. Finding People**

  ------------------------------------------------------------ ---------------------------------------------------------------
  **User Story**                                               **Notes**
  As a user I can search for other users by name or username   
  As a user I can view a public profile                        *Shows check-ins, Trails, follower/following count*
  As a user I can follow and unfollow people                   *One-directional, Instagram-style*
  As a user I can send a follow request to a private account   *Request sits pending until approved/denied*
  As a private user I can approve or deny follow requests      
  As a user I can block and unblock other users                *Safety --- blocked users cannot see your profile or content*
  ------------------------------------------------------------ ---------------------------------------------------------------

**3. Check-ins**

  ---------------------------------------------------------------------------------------------------- --------------------------------------------------------
  **User Story**                                                                                       **Notes**
  As a user I can check in to a restaurant using my current location                                   *Uses Google Places API*
  As a user I can check in to a restaurant remotely by searching for it                                *Critical for logging past experiences and onboarding*
  As a user I can add photos, notes, and a rating to my check-in                                       *Core of the personal journal experience*
  As a user I can log what I ate during a check-in                                                     *Dish name/description*
  As a user when I check in to a place I have visited before, I see my previous visits automatically   *The memory feature --- core to Crumb\'s identity*
  As a user I can view my full history of visits to a specific restaurant                              *All past check-ins at one place*
  As a user I can browse all my past check-ins as a personal feed                                      *My diary view*
  ---------------------------------------------------------------------------------------------------- --------------------------------------------------------

**4. Social Feed**

  ----------------------------------------------------------------------------------------------------- -----------------------------------------
  **User Story**                                                                                        **Notes**
  As a user I see a chronological feed of check-ins from people I follow                                *The home screen experience*
  As a user I can tap a check-in in the feed to see full details                                        *Photos, notes, dish, rating*
  As a user when I check in to a restaurant I can see which friends have been there and what they had   *Social discovery at point of check-in*
  ----------------------------------------------------------------------------------------------------- -----------------------------------------

**5. Trails**

  ------------------------------------------------------------------------------------------------------ ----------------------------------------------------
  **User Story**                                                                                         **Notes**
  As a user I can create a Trail (a curated list of my favorite restaurants)                             *e.g. My Top 10, Best Tacos, Date Night Spots*
  As a user I can add restaurants to a Trail from my existing check-ins                                  *Each entry is backed by real experience*
  As a user I can rank the restaurants within a Trail                                                    *Ordered list, user defines the ranking*
  As a user my Trails are visible on my public profile                                                   *Shareable and discoverable*
  As a user I can tap a restaurant in someone\'s Trail and see the experience that earned it that spot   *Photos, notes, dishes from their actual check-in*
  ------------------------------------------------------------------------------------------------------ ----------------------------------------------------

**6. Notifications**

  -------------------------------------------------------------------------------- ---------------------------------------------
  **User Story**                                                                   **Notes**
  As a user I am notified when someone follows me                                  
  As a user I am notified when a follow request is approved                        
  As a user I am notified when a friend checks in to a restaurant I have been to   *Drives re-engagement and social discovery*
  -------------------------------------------------------------------------------- ---------------------------------------------

**Post-MVP Features (V2)**

*These features add value but are not required for Crumb to feel like
Crumb on day one. Build them after validating the core loop with real
users.*

  ---------------------------- ---------------------------------------------------------------------------------------------------
  **Feature**                  **Description**
  **Multiple Trails**          Users can create multiple themed Trails (e.g. NYC favorites, best tacos, date night)
  **Trail Discovery**          Browse and search Trails by city or cuisine from people you follow or public profiles
  **AI Suggestions**           Personalized restaurant recommendations based on your check-in history and taste profile
  **Smart Summaries**          AI-generated insights like: You have visited this place 4 times and always order the pasta
  **Taste-matched Ads**        Restaurants pay to be suggested to users whose taste profile matches them. Not ads --- relevance.
  **Advanced Notifications**   Likes, comments on check-ins, and Trail saves by other users
  ---------------------------- ---------------------------------------------------------------------------------------------------

**Agreed Tech Stack**

  ------------------- --------------------------------------------------------------------------------
  **Layer**           **Decision**
  **Mobile**          React Native (New Architecture --- Fabric + JSI)
  **Backend & DB**    Supabase (PostgreSQL --- scales well, supports geospatial queries via PostGIS)
  **Media Storage**   Cloudflare R2 or AWS S3 (photos and videos at scale)
  **Location Data**   Google Places API (New) --- restaurant search, details, check-in anchor
  ------------------- --------------------------------------------------------------------------------

*Crumb --- Confidential. Built with ♥ and a lot of tacos.*
