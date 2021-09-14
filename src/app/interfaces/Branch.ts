export interface BranchArray {
  pageNo?: number;
  pageSize?: number;
  pageTotal?: number;
  branchResponseDtos?: Branch[];
}

export interface Branch {
  branchId?: number;
  branchName?: string;
  address?: string;
  isAvailable?: boolean;
  openingDate?: string;
  phone?: string;
}
