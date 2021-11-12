import { UserProfile } from "./user-profile";

export class UserProfileResponse {
    Status!: number;
    Result!: UserProfileData;

    getUserProfile(): UserProfile {
        let userProfile: UserProfile = {
            firstName: this.Result.firstName,
            lastName: this.Result.lastName,
            emailId: this.Result.emailId,
            managerEmailId: this.Result.managerEmailId,
            userId: this.Result.userId,
            userCategoryId: this.Result.userCategoryId,
            borisId: this.Result.borisId,
            isActive : this.Result.isActive,
            userCategory : this.Result.userCategory
        };

        return userProfile;
    }
}

export class UserProfileListResponse{
    Status!: number;
    Result!: UserProfileResult;
}

export class UserProfileResult{
    totalCount!: number;
    userInfo: UserProfileData[] = []
}

export class UserProfileData {
    borisId!: number;
    userCategoryId!: number;
    userCategory!: string;
    userId!: string;
    firstName!: string;
    lastName!: string;
    emailId!: string;
    managerEmailId!: string;
    isActive!: boolean;    
}