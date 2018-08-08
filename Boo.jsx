import a from 'axios'
import React from "react";
import Loadable from 'react-loadable';
import ImagePlaceHolder from './ImagePlaceHolder';

export default class BooBoo {
    static ChangeEvents = [];
    static Data = {};

    static AddChangeEventWithArray(KeyValues, Func) {
        KeyValues.forEach(Key => {
            this.ChangeEvents.push({Key: Key, Func: Func})
        })

    }

    static AddChangeEventWithObject(Obj) {
        let Keys = Object.keys(Obj);
        Keys.forEach(Key => {
            BooBoo.ChangeEvents.push({Key: Key, Func: Obj[Key]})
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

    static MakeLoadable(Component,Loader = ImagePlaceHolder){
        return Loadable({
            loader: () => Component,
            loading:Loader
        })
    }
    static MakeLoadableWithImage(Component,PathToImage,Classes,Styles){
        return Loadable({
            loader: () => Component,
            loading:class ImagePlaceHolder_ extends React.Component
            {
                render(){

                    return <img src={PathToImage} style={Styles} className={Classes}/>
                }
            }
        })
    }
    static CancelHttp(Interval) {
        clearInterval(Interval);
    }
    static async SingleHttp(Request, Key,  ErrorHandler) {
            try {
                let DataOut = {};
                DataOut[Key] = await a(Request);
                UpdateData(DataOut, {Request: Request.data, Status:Request.status, Key: Key});
            } catch (E) {
                if (ErrorHandler) ErrorHandler(E, Key, Request);
            }

    }
    static RepeatingHttp(Request, Key, Interval, ErrorHandler) {
        let ThisInterval;
        let Updater = async () => {
            try {
                let DataOut = {};
                DataOut[Key] = await a(Request);
                UpdateData(DataOut, {Request: Request.data, Status:Request.status, Key: Key, Interval: ThisInterval});
            } catch (E) {
                if (ErrorHandler) ErrorHandler(E, Key, Request, ThisInterval);
            }
        }
        return ThisInterval = setInterval(Updater, Interval);
    }


}

export const UpdateData = BooBoo.UpdateData;
export const AddChangeEventWithObject = BooBoo.AddChangeEventWithObject;
export const AddChangeEventWithArray = BooBoo.AddChangeEventWithArray;
export const GetData = (Key) => BooBoo.Data[Key];
export const CodeSplitComponentWithImage = BooBoo.MakeLoadableWithImage;
export const CodeSplitComponent = BooBoo.MakeLoadable;
export const CreateSingleHttp = BooBoo.SingleHttp;
export const CreateRepeatingHttp = BooBoo.RepeatingHttp;
export const CancelRepeatingHttp = BooBoo.CancelHttp;

