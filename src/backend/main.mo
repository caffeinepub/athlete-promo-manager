import Array "mo:core/Array";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Type definitions
  type MediaType = {
    #photo;
    #video;
  };

  type Sport = {
    #football;
    #basketball;
    #both;
  };

  type AchievementCategory = {
    #gameStat;
    #award;
    #milestone;
  };

  type CollegeDivision = {
    #d1;
    #d2;
    #d3;
    #naia;
    #juco;
  };

  type ScholarshipStatus = {
    #researching;
    #contacted;
    #interested;
    #visited;
    #applied;
    #offered;
    #committed;
    #declined;
  };

  type SocialPlatform = {
    #twitter;
    #instagram;
    #facebook;
    #all;
  };

  type PostStatus = {
    #draft;
    #scheduled;
    #posted;
  };

  type AthleteProfile = {
    name : Text;
    sport : Sport;
    position : Text;
    graduationYear : Nat;
    gpa : Text;
    bio : Text;
    height : Text;
    weight : Text;
    city : Text;
    state : Text;
    hudlLink : Text;
    twitterHandle : Text;
    instagramHandle : Text;
  };

  type Achievement = {
    id : Nat;
    title : Text;
    sport : Sport;
    category : AchievementCategory;
    description : Text;
    date : Time.Time;
    stats : [(Text, Text)];
  };

  type ScholarshipTarget = {
    id : Nat;
    collegeName : Text;
    division : CollegeDivision;
    sport : Sport;
    coachName : Text;
    coachEmail : Text;
    coachPhone : Text;
    status : ScholarshipStatus;
    notes : Text;
    lastContactDate : Time.Time;
  };

  type ContentPost = {
    id : Nat;
    platform : SocialPlatform;
    caption : Text;
    hashtags : [Text];
    status : PostStatus;
    scheduledDate : ?Time.Time;
    achievementId : ?Nat;
    mediaUrls : [Text];
  };

  type MediaItem = {
    id : Nat;
    blob : Storage.ExternalBlob;
    mediaType : MediaType;
    caption : Text;
    uploadDate : Time.Time;
    tags : [Text];
  };

  // Persistent storage
  let profile = Map.empty<Principal, AthleteProfile>();
  let achievements = Map.empty<Nat, Achievement>();
  let scholarshipTargets = Map.empty<Nat, ScholarshipTarget>();
  let contentPosts = Map.empty<Nat, ContentPost>();
  let mediaItems = Map.empty<Nat, MediaItem>();

  // Track which athlete owns which data
  let achievementOwners = Map.empty<Nat, Principal>();
  let scholarshipOwners = Map.empty<Nat, Principal>();
  let postOwners = Map.empty<Nat, Principal>();
  let mediaOwners = Map.empty<Nat, Principal>();

  // Incremental ID counters
  var nextAchievementId = 1;
  var nextScholarshipId = 1;
  var nextPostId = 1;
  var nextMediaId = 1;

  func compareNat(a : Nat, b : Nat) : { #greater; #equal; #less } {
    if (a < b) { #less } else if (a > b) { #greater } else { #equal };
  };

  func compareAchievement(a : Achievement, b : Achievement) : { #greater; #equal; #less } {
    compareNat(a.id, b.id);
  };

  func compareScholarshipTarget(a : ScholarshipTarget, b : ScholarshipTarget) : { #greater; #equal; #less } {
    compareNat(a.id, b.id);
  };

  func compareContentPost(a : ContentPost, b : ContentPost) : { #greater; #equal; #less } {
    compareNat(a.id, b.id);
  };

  func compareMediaItem(a : MediaItem, b : MediaItem) : { #greater; #equal; #less } {
    compareNat(a.id, b.id);
  };

  // Required user profile functions for frontend
  public query ({ caller }) func getCallerUserProfile() : async ?AthleteProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    profile.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?AthleteProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profile.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(p : AthleteProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profile.add(caller, p);
  };

  // Athlete profile
  public shared ({ caller }) func saveAthleteProfile(p : AthleteProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profile.add(caller, p);
  };

  public query ({ caller }) func getAthleteProfile(user : Principal) : async ?AthleteProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or be an admin");
    };
    profile.get(user);
  };

  // Achievements - any authenticated user can manage their own data
  public shared ({ caller }) func addAchievement(a : Achievement) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be logged in to add achievements");
    };
    let id = nextAchievementId;
    nextAchievementId += 1;
    let newAchievement : Achievement = {
      a with
      id;
    };
    achievements.add(id, newAchievement);
    achievementOwners.add(id, caller);
    id;
  };

  public shared ({ caller }) func deleteAchievement(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be logged in to delete achievements");
    };
    // Verify ownership
    switch (achievementOwners.get(id)) {
      case null {
        Runtime.trap("Achievement not found");
      };
      case (?owner) {
        if (owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own achievements");
        };
        achievements.remove(id);
        achievementOwners.remove(id);
      };
    };
  };

  public query ({ caller }) func getAchievements() : async [Achievement] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view achievements");
    };
    // Filter to only return caller's achievements
    let allAchievements = achievements.entries();
    let filtered = allAchievements.toArray().filter(
      func((id, _)) : Bool {
        switch (achievementOwners.get(id)) {
          case null { false };
          case (?owner) { owner == caller };
        };
      },
    );
    filtered.map<(Nat, Achievement), Achievement>(func((_, a)) : Achievement { a }).sort(compareAchievement);
  };

  // Scholarship targets - any authenticated user can manage their own data
  public shared ({ caller }) func addScholarshipTarget(s : ScholarshipTarget) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be logged in to add scholarship targets");
    };
    let id = nextScholarshipId;
    nextScholarshipId += 1;
    let newTarget : ScholarshipTarget = {
      s with
      id;
    };
    scholarshipTargets.add(id, newTarget);
    scholarshipOwners.add(id, caller);
    id;
  };

  public shared ({ caller }) func deleteScholarshipTarget(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be logged in to delete scholarship targets");
    };
    // Verify ownership
    switch (scholarshipOwners.get(id)) {
      case null {
        Runtime.trap("Scholarship target not found");
      };
      case (?owner) {
        if (owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own scholarship targets");
        };
        scholarshipTargets.remove(id);
        scholarshipOwners.remove(id);
      };
    };
  };

  public query ({ caller }) func getScholarshipTargets() : async [ScholarshipTarget] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view scholarship targets");
    };
    // Filter to only return caller's scholarship targets
    let allTargets = scholarshipTargets.entries();
    let filtered = allTargets.toArray().filter(
      func((id, _)) : Bool {
        switch (scholarshipOwners.get(id)) {
          case null { false };
          case (?owner) { owner == caller };
        };
      },
    );
    filtered.map<(Nat, ScholarshipTarget), ScholarshipTarget>(func((_, s)) : ScholarshipTarget { s }).sort(compareScholarshipTarget);
  };

  // Content posts - any authenticated user can manage their own data
  public shared ({ caller }) func addContentPost(p : ContentPost) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be logged in to add content posts");
    };
    let id = nextPostId;
    nextPostId += 1;
    let newPost : ContentPost = {
      p with
      id;
    };
    contentPosts.add(id, newPost);
    postOwners.add(id, caller);
    id;
  };

  public shared ({ caller }) func deleteContentPost(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be logged in to delete content posts");
    };
    // Verify ownership
    switch (postOwners.get(id)) {
      case null {
        Runtime.trap("Content post not found");
      };
      case (?owner) {
        if (owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own content posts");
        };
        contentPosts.remove(id);
        postOwners.remove(id);
      };
    };
  };

  public query ({ caller }) func getContentPosts() : async [ContentPost] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view content posts");
    };
    // Filter to only return caller's content posts
    let allPosts = contentPosts.entries();
    let filtered = allPosts.toArray().filter(
      func((id, _)) : Bool {
        switch (postOwners.get(id)) {
          case null { false };
          case (?owner) { owner == caller };
        };
      },
    );
    filtered.map<(Nat, ContentPost), ContentPost>(func((_, p)) : ContentPost { p }).sort(compareContentPost);
  };

  // Media items - any authenticated user can manage their own data
  public shared ({ caller }) func addMediaItem(mediaType : MediaType, caption : Text, tags : [Text], blob : Storage.ExternalBlob) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be logged in to add media items");
    };
    let id = nextMediaId;
    nextMediaId += 1;
    let item : MediaItem = {
      id;
      blob;
      mediaType;
      caption;
      uploadDate = Time.now();
      tags;
    };
    mediaItems.add(id, item);
    mediaOwners.add(id, caller);
    id;
  };

  public shared ({ caller }) func deleteMediaItem(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be logged in to delete media items");
    };
    // Verify ownership
    switch (mediaOwners.get(id)) {
      case null {
        Runtime.trap("Media item not found");
      };
      case (?owner) {
        if (owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only delete your own media items");
        };
        mediaItems.remove(id);
        mediaOwners.remove(id);
      };
    };
  };

  public query ({ caller }) func getMediaItems() : async [MediaItem] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view media items");
    };
    // Filter to only return caller's media items
    let allMedia = mediaItems.entries();
    let filtered = allMedia.toArray().filter(
      func((id, _)) : Bool {
        switch (mediaOwners.get(id)) {
          case null { false };
          case (?owner) { owner == caller };
        };
      },
    );
    filtered.map<(Nat, MediaItem), MediaItem>(func((_, m)) : MediaItem { m }).sort(compareMediaItem);
  };
};
