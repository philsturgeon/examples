import { OpenAPIV3 } from "openapi-types";

export type IExtensionName = `x-${string}`;
export type IExtensionType = any;
export type ISpecificationExtension = {
  [extensionName: IExtensionName]: IExtensionType;
};

export type ExtendedDocument = OpenAPIV3.Document & ISpecificationExtension;
export type ExtendedOperationObject =
  OpenAPIV3.OperationObject<ISpecificationExtension>;
