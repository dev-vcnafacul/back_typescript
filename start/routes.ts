import Route from '@ioc:Adonis/Core/Route'

Route.post('/cadastro', 'AuthController.register')
Route.post('/login', 'AuthController.login')
Route.get('/logout', 'AuthController.logout').middleware('auth')
Route.get('/me', 'AuthController.me').middleware('auth')
Route.put('/patchme', 'AuthController.patchme').middleware('auth')
Route.patch('/patchadmin', 'AuthController.patchAdmin').middleware('auth')

Route.post('/esqueci-minha-senha', 'ForgotsController.forgot')
Route.patch('/reset', 'ForgotsController.reset')

Route.post('/novoexame', 'ExamsController.NovoExame').middleware('auth')
Route.delete('/delexam/:id', 'ExamsController.DelExam').middleware('auth')
Route.get('/listarexams', 'ExamsController.ListarExams').middleware('auth')

Route.post('/novaquestao', 'QuestionsController.NovaQuestao').middleware('auth')
Route.delete('/deletarquestao/:id', 'QuestionsController.DeletarQuestao').middleware('auth')
Route.get('/selecionarquestao/:id', 'QuestionsController.SelecionarQuestao').middleware('auth')

Route.get('/listallquestion', 'QuestionsController.ListarQuestoes')

Route.post('/xlsx', 'QuestionsController.XlsxUploadQuestion').middleware('auth')

Route.get('/allenem', 'EnemsController.AllEnem').middleware('auth')

Route.post('/newtypesimulate', 'SimuladosController.CriarTipo').middleware('auth')
Route.delete('/deltypesimulate/:id', 'SimuladosController.DeletarTipo').middleware('auth')
Route.get('/listtypesimulate', 'SimuladosController.ListarTipos').middleware('auth')

Route.post('/newsimulate', 'SimuladosController.CriarSimulado').middleware('auth')
Route.get('/callsimulate/:id', 'SimuladosController.ChamarSimulado').middleware('auth')
Route.post('/answersimulate', 'SimuladosController.RespostaSimulado').middleware('auth')
