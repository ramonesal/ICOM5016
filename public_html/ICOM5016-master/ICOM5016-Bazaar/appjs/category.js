//the parameter subCategories will be an array of categories.

function Category(name, mother){
	this.id = "";
	this.name = name;
	this.mother =  mother;
	this.toJSON = toJSON;
}
