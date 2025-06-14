import axios from 'axios';
import { apiClient } from '../apiClient';
import { ProductCourse } from '../types';

export interface CreateUserProductService{
    productid:string,
    amount:string,
    transactionid?:string,
    createdat?:string,
    isdeleted?:boolean,
    status?:boolean
}

export interface GetUserProductService {
    userproductid:string,
    userid:string,
    productid:string,
    amount:string,
    transactionid?:string,
    createdat?:string,
    isdeleted?:boolean,
    status?:boolean,
    products:ProductCourse
}

export interface UpdateProcuctService{
  transactionid:string,
  status:boolean
}

export const userProductService = {
  async createUserProduct(userProductData: CreateUserProductService): Promise<boolean> {  
    try {
       await apiClient.post<CreateUserProductService>(`/userproducts`, {
        data: userProductData
      });     
      return true;
    } catch (error) {
      console.error('Error creating user product:', error);
      return false;
    }
  },

  async getUserProductsByUserId(status?: boolean): Promise<GetUserProductService[]> {    
    try {
      const response = await apiClient.get<GetUserProductService[]>(`/userproducts/userid/id`, {
        params: { status }
      });
      return response;
    } catch (error) {
      console.error('Error getting user products:', error);
      return [];
    }
  },

  async deleteUsersProducts(id:string): Promise<boolean> {  
    try {
       await apiClient.delete<CreateUserProductService>(`/userproducts/${id}`);     
      return true;
    } catch (error) {
      console.error('Error deleting user product:', error);
      return false;
    }
  },

  async updateUsersProducts(id:string,updateProductData: UpdateProcuctService): Promise<boolean> {  
    try {
       await apiClient.patch<UpdateProcuctService>(`/userproducts/${id}`, {
        data: updateProductData
      });     
      return true;
    } catch (error) {
      return false;
    }
  }
}