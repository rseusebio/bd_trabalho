select * from 
( select id_paciente, 
         id_atendimento, 
         analito, 
         count(*) as qtd 
         from Exame group by id_paciente, id_atendimento, analito ) as tb1 
where qtd > 1 
order by qtd;


select * 
from Exame 
where 
id_paciente like "376CA07DC7EC73C108D1F44579C7134F" 
and id_atendimento like "6E799577140A78E2024143B7789F89B0"
and analito like "Hematócrito";

select 
id_paciente, id_atendimento, analito, dt_coleta, count(*)
from Exame 
where 
id_paciente like "376CA07DC7EC73C108D1F44579C7134F" 
and id_atendimento like "6E799577140A78E2024143B7789F89B0"
and analito like "Hematócrito"
group by id_paciente, id_atendimento, analito, dt_coleta
order by count(*);

select 
*
from Exame 
where 
id_paciente like "376CA07DC7EC73C108D1F44579C7134F" 
and id_atendimento like "6E799577140A78E2024143B7789F89B0"
and analito like "Hematócrito"
and dt_coleta like "23/08/2020";


select * from 
( select id_paciente, 
         id_atendimento,
         dt_coleta, 
         origem,
         analito,
         descricao 
         resultado,
         unidade,
         count(*) as qtd 
         from Exame group by id_paciente, id_atendimento, dt_coleta, origem, analito, descricao, resultado, unidade ) as tb1 
where qtd > 1 
order by qtd desc limit 10 ;


select * from 
( select id_paciente, 
         id_atendimento, 
         origem, 
         dt_coleta,
         analito, 
         resultado,
         descricao,
         count(*) as qtd 
         from Exame group by id_paciente, id_atendimento, origem, dt_coleta, analito, resultado, descricao ) as tb1 
where qtd > 1 
order by qtd desc 
limit 10;


select 
*
from Exame 
where 
id_paciente like "F5B5BD59D98836D8AA2D8C27B01225AB" 
and id_atendimento like "FBF3FC0FD4890AF6B6EBFE6BFC12EC0C"
and origem like "UTI"
and dt_coleta like "21/06/2020";
and analito like "Herpes Simplex, Tipo 1 e 2, IgM";


select * from 
( select id_paciente, 
         id_atendimento, 
         origem, 
         dt_coleta,
         analito, 
         descricao,
         resultado,
         count(*) as qtd 
         from Exame group by id_paciente, id_atendimento, origem, dt_coleta, analito, descricao, resultado ) as tb1 
where qtd > 1 
order by qtd desc 
limit 10;



select 
*
from Exame 
where 
id_paciente like "009F46271AA900748E4C1988E51427DC" 
and id_atendimento like "632FF539ECBB5038A72F2F7925646C68"
and origem like "Laboratório de Patologia Clínica - Itaim"
and dt_coleta like "10/11/2020"
and analito like "Volume (mL)"
and resultado like "1700";

select 
*
from Exame 
where 
id_paciente like "F5B5BD59D98836D8AA2D8C27B01225AB" 
and id_atendimento like "FBF3FC0FD4890AF6B6EBFE6BFC12EC0C"
and origem like "UTI"
and dt_coleta like "21/06/2020"
and analito like "Herpes Simplex, Tipo 1 e 2, IgM"
and descricao like "Herpes Simp.Tp 1 e 2, Sorol. Igm";


select 
*
from Exame 
where 
id_paciente like "AF25C4F72E18C39D98C020F77880A0CE" 
and id_atendimento like "91A088213BFF57DF2F9B016EFD03142D"
and origem like "Centro de Oncologia"
and dt_coleta like "13/07/2020"
and analito like "Cálculo p/não afrodescendente MDRD"
and descricao like "Calculo da Estimativa da Taxa, de Filtracao Glomular, soro";


select id_atendimento, origem, count(*) 
from Exame 
group by id_atendimento, origem 
order by id_atendimento, origem;

select * from Desfecho where id_atendimento like "FFF97A24B66BDA62E4FA726E5FDFB5DE";

select * from 
( select id_paciente, 
         id_atendimento, 
         dt_coleta, 
         origem,
         descricao, 
         analito,
         count(*) as qtd 
         from Exame group by id_paciente, id_atendimento, dt_coleta, 
         origem, descricao,analito ) as tb1 
where qtd > 1 
order by qtd desc 
limit 10;

select * from 
( select id_paciente, 
         id_atendimento, 
         dt_coleta, 
         origem, 
         descricao,
          analito,
          resultado,
         count(*) as qtd 
         from Exame group by 
         id_paciente, 
         id_atendimento,
         dt_coleta,
         origem, 
         descricao, 
         analito, 
         resultado ) as tb1 
where qtd > 1 
order by qtd desc 
limit 10;


select * 
from Exame 
where id_paciente like "0CEAD21EA5B30960934403A750A0A131"
and id_atendimento like "804BA96648694ABA5DC56BAD53F735BF"
and dt_coleta like "27/08/2020"
and origem like "UTI"
and descricao like "Gasometria Arterial";

select * from Paciente left join Exame on Paciente.id_paciente = Exame.id_paciente where Exame.id_paciente is null;


/* Numero total de pacientes por estado / muni