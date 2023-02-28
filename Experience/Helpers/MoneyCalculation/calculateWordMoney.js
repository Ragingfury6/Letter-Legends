import Letters from "../../Constants/Letters";

export default function calculateWordMoney(word) {
    let overallValue = word.split("").reduce((a,e)=>{
        return a + Letters.LetterValues.find(v=>v.letter==e).value;
    },0);
    if(word.length >= 4) overallValue*=(Math.sqrt(word.length) * 1.4);
    return Math.floor(overallValue);
};