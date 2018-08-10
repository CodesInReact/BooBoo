# BooBoo
A replacement for redux and enforcer of Code Split

# Code Splitting
Change all your imports from this oldness
```javascript
    import Parallax from "components/Parallax/Parallax.jsx"
  
```

To the new way:

```javascript
  
  let Parallax = CodeSplitComponent( import( "components/Parallax/Parallax.jsx"));
```
or (other new way)

```javascript
  
let Parallax = CodeSplitComponent( import( "components/Parallax/Parallax.jsx"), 
class X extends React.Component { render() { return <div />} });

```

go from 
```javascript
  549.95 KB  build\static\js\main.27aec380.js
  8.54 KB    build\static\js\0.4cea4888.chunk.js
  3.83 KB    build\static\css\main.95a73a22.css
  2.91 KB    build\static\js\1.cd0c7ba2.chunk.js
----
``` 
to this
```javascript
 57.16 KB  build\static\js\1.6644b2a6.chunk.js
  53.96 KB  build\static\js\main.38ff3f94.js
  40.23 KB  build\static\js\0.19090408.chunk.js
  11.55 KB  build\static\js\2.e9b3653a.chunk.js
  10.64 KB  build\static\js\3.cca05f33.chunk.js
  3.83 KB   build\static\css\main.95a73a22.css
  2.07 KB   build\static\js\8.0ea5a055.chunk.js
  1.71 KB   build\static\js\5.bb07580b.chunk.js
  1.67 KB   build\static\js\4.18160b87.chunk.js
  1.34 KB   build\static\js\10.95974f1e.chunk.js
  1.28 KB   build\static\js\7.c9661b81.chunk.js
  1.26 KB   build\static\js\6.1db0e9e1.chunk.js
  748 B     build\static\js\9.46930403.chunk.js
  509 B     build\static\js\12.87029f29.chunk.js
  372 B     build\static\js\11.1df4baaa.chunk.js

```
BooBoo does two things for you. 
# State Management
A react object that will remove the need for redux and other bulky libraries


Very easy to use. No npm installs

Include the file every where you would need data.

```javascript
  import {UpdateData,AddChangeEventWithArray,AddChangeEventWithObject,GetData}  from 'boobs'
  
  //Add an event hook for when a particular data key changes
  //State is useful when you want to pass along parameters but not globlly
  AddChangeEventWithObject({Image2Seen: (Data,State)=>
            {
                if(State && State.ShouldSetSetState)
                {
                  this.setState(Data);
                }
            }
        });
        
```

# A little bit later

Update the Data
```javascript

  UpdateData({Image2Seen:true});
```  
or
```javascript  
  
 UpdateData({Image2Seen:true},{ShouldSetState:true});
```

You can also bind a lot of keys to one hook with 
```javascript

   AddChangeEventWithArray(["Image2Seen"], (Data,State)=>
            {
                this.setState(Data);
            }
        });
```

If you use this in a component you need to use/track event hooks. Or for any reason you just don't want it anymore

#RemoveChangeEventWithID ID

```javascript
  constructor(props) { 
  super(props); 
  this.IDs_ = []
  }
  
  componentDidMount()
    {
      this.IDs_.push(AddChangeEventWithObject({EmailEvent:this.EmailEventCallBack.bind(this)}));
    }
 
    componentWillUnmount()
    {
        this.IDs_.forEach(RemoveChangeEventWithID);
    }
    
```
  There is also `UpdateDataNoEvent` if you want to just store data.
  
  
#CreateSingleHttp(Key,Request,OnError) 
//triggers key automatically with data for you

```javascript
  Submit() {

        let FinalData = GetData("UserContactObject");
        CreateSingleHttp("EmailEvent",{url:"form.php",data:FinalData},this.HttpError.bind(this))

    }
```

#CreateRepeatingHttp

//triggers key automatically with data for you with an interval

```javascript
  (TopLayerComponent)ComponentDidMount() {

    let Interval  = 30000;
      this.RepeaterID=  CreateRepeatingHttp({url:'/users/me'}, "MyDataKey", Interval,this.HttpError.bind(this))

    }
```    
    #CancelRepeatingHttp
    
```javascript
    (TopLayerComponent)ComponentWillUnMount() {

      CancelRepeatingHttp(this.RepeaterID);
      

    }

```
All worth looking at. Save you a lot of time in your api->statemanagement calls. 




``` npm install --save Loadable axios``` we ain't npm yet boys
