(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-29b784e8"],{"0163":function(e,t,a){"use strict";a("a57e")},"04a3":function(e,t,a){"use strict";a.d(t,"a",(function(){return l}));var i=a("b85c"),l=function(e){var t,a=Object(i["a"])(e);try{for(a.s();!(t=a.n()).done;){t.value;return!1}}catch(l){a.e(l)}finally{a.f()}return!0}},"0d88":function(e,t,a){},8308:function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"profile-view"},[a("div",{staticClass:"profile-view__content"},[a("ProfileForm",{staticClass:"profile-view__detail",attrs:{profile:e.profile},on:{submit:e.updateProfile}}),a("img",{staticClass:"profile-view__avatar",attrs:{src:e.avatar,alt:"Current User Avatar"}}),a("div",{staticClass:"profile-view__btn-wrapper"},[a("button",{staticClass:"profile-view__btn --logout",on:{click:e.logoutRequest}},[a("fa-icon",{attrs:{icon:"sign-out-alt"}}),e._v("Logout")],1),a("button",{staticClass:"profile-view__btn --delete",on:{click:e.deleteRequest}},[a("fa-icon",{attrs:{icon:"exclamation-triangle"}}),e._v("Delete Account ")],1)])],1)])},l=[],s=a("1da1"),n=a("d4ec"),r=a("bee2"),o=a("262e"),c=a("2caf"),u=(a("96cf"),a("9ab4")),f=a("60a3"),p=a("6c7d"),d=a("0a4f"),m=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("form",{staticClass:"profile-form",attrs:{novalidate:""},on:{submit:function(t){return t.preventDefault(),e.handleSubmit(t)}}},[a("h2",{staticClass:"profile-form__headline"},[e._v("Edit profile")]),a("TextInput",{staticClass:"profile-form__input",attrs:{field:e.formFields.name,fieldName:"name"},model:{value:e.formFields.name.value,callback:function(t){e.$set(e.formFields.name,"value",t)},expression:"formFields.name.value"}}),a("TextInput",{staticClass:"profile-form__input",attrs:{field:e.formFields.email,fieldName:"email"},model:{value:e.formFields.email.value,callback:function(t){e.$set(e.formFields.email,"value",t)},expression:"formFields.email.value"}}),a("TextInput",{staticClass:"profile-form__input",attrs:{field:e.formFields.password,type:"password",fieldName:"password"},model:{value:e.formFields.password.value,callback:function(t){e.$set(e.formFields.password,"value",t)},expression:"formFields.password.value"}}),a("TextInput",{staticClass:"profile-form__input",attrs:{field:e.repeatField,type:"password",fieldName:"password-repeat"},model:{value:e.repeatField.value,callback:function(t){e.$set(e.repeatField,"value",t)},expression:"repeatField.value"}}),a("p",{staticClass:"profile-form__label"},[e._v("Change avatar:")]),a("ImageUploader",{staticClass:"profile-form__uploader",attrs:{limit:1},model:{value:e.files,callback:function(t){e.files=t},expression:"files"}}),a("button",{staticClass:"profile-form__btn-save",attrs:{type:"submit"}},[e._v("Save")])],1)},v=[],b=a("3835"),h=(a("b0c0"),a("4fad"),a("d3b7"),a("ddb0"),a("4c1e")),g=a("8422"),w=a("04a3"),_=a("caeb"),j=a("f5e2"),O=function(e){Object(o["a"])(a,e);var t=Object(c["a"])(a);function a(){var e;return Object(n["a"])(this,a),e=t.apply(this,arguments),e.formFields={name:new _["a"]("Name",!1,[]),email:new _["a"]("Email",!1,[]),password:new _["a"]("New password",!1,[])},e.repeatField=new _["a"]("Repeat new password",!1,[j["a"].matches(e.formFields.password)]),e.files=[],e}return Object(r["a"])(a,[{key:"mounted",value:function(){this.mapToFields()}},{key:"profileUpdated",value:function(){this.mapToFields()}},{key:"mapToFields",value:function(){this.formFields.name.value=this.profile.name,this.formFields.email.value=this.profile.email,this.formFields.password.value="",this.repeatField.value="",this.files=[]}},{key:"handleSubmit",value:function(){this.repeatField.validate()&&this.submit()}},{key:"submit",value:function(){var e=new FormData;this.files.length&&e.append("avatar",this.files[0],this.files[0].name);for(var t=0,a=Object.entries(this.formFields);t<a.length;t++){var i=Object(b["a"])(a[t],2),l=i[0],s=i[1];s.value&&s.value!==this.profile[l]&&e.append(l,s.value)}Object(w["a"])(e.keys())||this.$emit("submit",e)}}]),a}(f["h"]);Object(u["b"])([Object(f["e"])()],O.prototype,"profile",void 0),Object(u["b"])([Object(f["i"])("profile")],O.prototype,"profileUpdated",null),O=Object(u["b"])([Object(f["a"])({components:{TextInput:h["a"],ImageUploader:g["a"]}})],O);var y=O,F=y,k=(a("0163"),a("2877")),C=Object(k["a"])(F,m,v,!1,null,null,null),x=C.exports,R=a("d079"),A=a("b01f"),I=function(e){Object(o["a"])(a,e);var t=Object(c["a"])(a);function a(){return Object(n["a"])(this,a),t.apply(this,arguments)}return Object(r["a"])(a,[{key:"logoutRequest",value:function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.logout();case 2:this.$router.push(p["b"].Login);case 3:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()},{key:"deleteRequest",value:function(){var e=Object(s["a"])(regeneratorRuntime.mark((function e(){var t=this;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:Object(A["a"])(this.showDialog({key:"profile-view/confirm-delete",text:"Would you like to delete your account? WARNING: This action is permanent, there is no way to retrieve a deleted account!",resolveBtn:"Yes, I'm aware what I'm doing, please delete my account"}),(function(){t.deleteAccount(),t.$router.push(p["b"].Login)}));case 1:case"end":return e.stop()}}),e,this)})));function t(){return e.apply(this,arguments)}return t}()},{key:"avatar",get:function(){return Object(R["a"])(this.profile.avatar)}},{key:"mounted",value:function(){var e=!!this.$route.query.confirmed;e&&this.showToast({id:"ProfileView/emailConfirmed",text:"Your new email has been confirmed."})}}]),a}(f["h"]);Object(u["b"])([d["a"].Action],I.prototype,"showToast",void 0),Object(u["b"])([d["a"].Action],I.prototype,"showDialog",void 0),Object(u["b"])([d["b"].State],I.prototype,"profile",void 0),Object(u["b"])([d["b"].Action],I.prototype,"logout",void 0),Object(u["b"])([d["b"].Action],I.prototype,"updateProfile",void 0),Object(u["b"])([d["b"].Action],I.prototype,"deleteAccount",void 0),I=Object(u["b"])([Object(f["a"])({components:{ProfileForm:x}})],I);var T=I,$=T,N=(a("8f63"),Object(k["a"])($,i,l,!1,null,null,null));t["default"]=N.exports},8422:function(e,t,a){"use strict";var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"image-uploader"},[a("label",{staticClass:"image-uploader__input"},[a("input",{attrs:{type:"file",id:"file",multiple:e.limit>1,accept:"image/*",disabled:e.value.length>=e.limit},on:{change:e.filesSelected}}),a("span",{attrs:{"file-input-value":e.fileString}})]),a("div",{staticClass:"image-uploader__preview"},[e._l(e.images,(function(t){return a("div",{key:t.uri,staticClass:"image-uploader__preview-item"},[a("img",{staticClass:"image-uploader__image",attrs:{src:t.uri,alt:""}}),a("fa-icon",{staticClass:"image-uploader__icon",attrs:{icon:"times"},on:{click:function(a){return e.removeImage(t)}}})],1)})),a("span",{staticClass:"image-uploader__preview-placeholder",class:{"-has-content":e.images.length}},[e._v("No images selected")])],2)])},l=[],s=a("2909"),n=a("d4ec"),r=a("bee2"),o=a("262e"),c=a("2caf"),u=(a("a630"),a("3ca3"),a("99af"),a("4de4"),a("caad"),a("2532"),a("159b"),a("9ab4")),f=a("60a3"),p=a("d079"),d=function(e){Object(o["a"])(a,e);var t=Object(c["a"])(a);function a(){var e;return Object(n["a"])(this,a),e=t.apply(this,arguments),e.images=[],e}return Object(r["a"])(a,[{key:"filesSelected",value:function(e){var t=Array.from(e.target.files);t.length&&this.input([].concat(Object(s["a"])(this.value),Object(s["a"])(t)))}},{key:"removeImage",value:function(e){this.input(this.value.filter((function(t){return e.file?t!==e.file:!e.uri.includes(t)})))}},{key:"fileString",get:function(){return this.value.length?"".concat(this.value.length," file").concat(this.value.length>1?"s":""," selected. ").concat(this.value.length>this.limit?"Remove ".concat(this.value.length-this.limit," file").concat(this.value.length>1?"s":"","."):""):"Choose ".concat(this.limit>1?"up to "+this.limit:"a"," file").concat(this.limit>1?"s":"","...")}},{key:"input",value:function(e){return e}},{key:"filesChanged",value:function(e){var t=this;this.images=[],e.forEach((function(e){if("string"===typeof e)t.images.push({uri:Object(p["a"])(e)});else{var a=new FileReader;a.onload=function(){t.images.push({file:e,uri:a.result})},a.readAsDataURL(e)}}))}}]),a}(f["h"]);Object(u["b"])([Object(f["e"])()],d.prototype,"value",void 0),Object(u["b"])([Object(f["e"])({default:1})],d.prototype,"limit",void 0),Object(u["b"])([Object(f["b"])()],d.prototype,"input",null),Object(u["b"])([Object(f["i"])("value")],d.prototype,"filesChanged",null),d=Object(u["b"])([Object(f["a"])({})],d);var m=d,v=m,b=(a("e1ef"),a("2877")),h=Object(b["a"])(v,i,l,!1,null,null,null);t["a"]=h.exports},"8f63":function(e,t,a){"use strict";a("0d88")},a57e:function(e,t,a){},e0f5:function(e,t,a){},e1ef:function(e,t,a){"use strict";a("e0f5")}}]);