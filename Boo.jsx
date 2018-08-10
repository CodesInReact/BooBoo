import a from 'axios'
import React from "react";
import Loadable from 'react-loadable';
import DivPlaceHolder from './DivPlaceHolder';

class BooBoo {
    static ChangeEvents = [];
    static Data = {};
    static ID_ = 0;

    static AddChangeEventWithArray(KeyValues, Func) {
        let ReturnKeys = [];
        KeyValues.forEach(Key => {
            BooBoo.ChangeEvents.push({Key: Key, ID_:BooBoo.ID_,Func: Func})
            ReturnKeys.push([{Key:BooBoo.ID_}]);
            BooBoo.ID_++;
        })
        return ReturnKeys;

    }

    static AddChangeEventWithObject(Obj) {
        let Keys = Object.keys(Obj);
        let ReturnKeys = [];
        Keys.forEach(Key => {
            BooBoo.ChangeEvents.push({Key: Key, ID_:BooBoo.ID_, Func: Obj[Key]})
            ReturnKeys.push([{Key:BooBoo.ID_}]);
            BooBoo.ID_++;
        })
        return ReturnKeys;
    }
    static RemoveID_(ID) {
        for(let i=BooBoo.ChangeEvents.length-1;i>=0;i--){
            if(BooBoo.ChangeEvents[i].ID_ !== ID) continue;
            BooBoo.ChangeEvents.splice(i,1);
            break;
        }
    }
    static UpdateDataNoEvent(Obj) {
        let Keys = Object.keys(Obj);
        Keys.forEach(Key => {
            BooBoo.Data[Key] = Obj[Key];
        })

    }
    static UpdateData(Obj, State) {
        let Keys = Object.keys(Obj);
        Keys.forEach(Key => {
            BooBoo.Data[Key] = Obj[Key];
        })

        Keys.forEach(Key => {
            BooBoo.ChangeEvents.forEach(Event => {
                let FuncData = {};
                FuncData[Key] = BooBoo.Data[Key];

                if (Event.Key === Key) Event.Func(FuncData, State);

            })

        })
    }

    static MakeLoadable(Component, Loader = DivPlaceHolder) {
        return Loadable({
            loader: () => Component,
            loading: Loader
        })
    }

    static MakeLoadableWithImage(Component, PathToImage, Classes, Styles) {
        return Loadable({
            loader: () => Component,
            loading: class ImagePlaceHolder_ extends React.Component {
                render() {

                    return <img src={PathToImage} style={Styles} className={Classes}/>
                }
            }
        })
    }

    static CancelHttp(Interval) {
        clearInterval(Interval);
    }

    static async SingleHttp(Request, Key, ErrorHandler) {
        try {
            let DataOut = {};
            DataOut[Key] = await a(Request);
            UpdateData(DataOut, {Request: Request.data, Status: Request.status, Key: Key});
        } catch (E) {
            if (ErrorHandler) ErrorHandler(E, Key, Request);
        }

    }
    static async SingleHttpNoEvent(Request,   ErrorHandler) {
        try {
            let DataOut = {};
            return await a(Request);

        } catch (E) {
            if (ErrorHandler) ErrorHandler(E,   Request);
        }

    }
    static RepeatingHttp(Request, Key, Interval, ErrorHandler) {
        let ThisInterval;
        let Updater = async () => {
            try {
                let DataOut = {};
                DataOut[Key] = await a(Request);
                UpdateData(DataOut, {Request: Request.data, Status: Request.status, Key: Key, Interval: ThisInterval});
            } catch (E) {
                if (ErrorHandler) ErrorHandler(E, Key, Request, ThisInterval);
            }
        }
        return ThisInterval = setInterval(Updater, Interval);
    }


}
export const UpdateDataNoEvent = BooBoo.UpdateDataNoEvent;
export const UpdateData = BooBoo.UpdateData;
export const AddChangeEventWithObject = BooBoo.AddChangeEventWithObject;
export const RemoveChangeEventWithID = BooBoo.RemoveID_;
export const AddChangeEventWithArray = BooBoo.AddChangeEventWithArray;
export const GetData = (Key) => BooBoo.Data[Key];
export const CodeSplitComponentWithImage = BooBoo.MakeLoadableWithImage;
export const CodeSplitComponent = BooBoo.MakeLoadable;
export const CreateSingleHttp = BooBoo.SingleHttp;
export const CreateSingleHttpNoEvent = BooBoo.SingleHttpNoEvent;
export const CreateRepeatingHttp = BooBoo.RepeatingHttp;
export const CancelRepeatingHttp = BooBoo.CancelHttp;

