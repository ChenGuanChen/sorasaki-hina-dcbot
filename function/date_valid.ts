export async function valid(
    year: number,
    month: number,
    date: number
): Promise<boolean>{
    let lunar = false;
    if(year % 400 === 0)lunar = true;
    else if(year % 4 === 0 && year % 100 !== 0)lunar = true;
    if(month === 2){
        if(!lunar && date > 28)return false;
        if(lunar && date > 29)return false;
    }
    else if(date > 30 &&
        (
            month === 4 ||
            month === 6 ||
            month === 9 ||
            month === 11
        )
    )return false;
    return true;
}