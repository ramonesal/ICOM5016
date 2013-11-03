function Product(pName, iPrice, bPrice, desc, model, photo, brand, dimensions, mCategory, cCategory, sellerId){
	this.id = "";
	this.pName = pName;
	this.iPrice = iPrice;
	this.bPrice = bPrice;
	this.desc = desc;
	this.model = model;
	this.photo = photo;
	this.brand = brand;
	this.dimensions = dimensions;
	this.toJSON = toJSON;
	this.mCategory = mCategory;
	this.cCategory = cCategory;
	this.sellerId;
}
