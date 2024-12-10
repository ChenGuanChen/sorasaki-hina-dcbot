import { Canvas, createCanvas, Image } from "@napi-rs/canvas";
import { logger } from "../../logger";
import { readFile } from "fs/promises";
import path from 'path'

export async function draw(
    x: number, 
    y: number, 
    sticker: string,
    width: number,
    height: number,
    pic?: Buffer, 
): Promise<Buffer | undefined>{
    try{
        const canvas = createCanvas(width, height); //868, 600
        const context = canvas.getContext(`2d`);
        const tar_png = new Image();
        if(sticker === '' && pic !== undefined){
            const basedimg = new Image();
            basedimg.src = pic;
            context.drawImage(
                basedimg, 
                0, 
                0, 
                canvas.width, 
                canvas.height
            );
            const result = await canvas.encode(`png`);
            return result;
        }
        const p = path.join(__dirname, `../../../files` + sticker);
        tar_png.src= await readFile(p);
        if(pic !== undefined){
            const basedimg = new Image();
            basedimg.src = pic;
            context.drawImage(
                basedimg, 
                0, 
                0, 
                canvas.width, 
                canvas.height
            );
            context.drawImage(
                tar_png, 
                x, 
                y, 
            );    
        }
        else{
            context.drawImage(
                tar_png, 
                0, 
                0,
                canvas.width,
                canvas.height, 
            );
        }
        const result = await canvas.encode(`png`);
        return result;
    }catch(err: unknown){
        logger.error(`${err}`);
        return undefined;
    }
}